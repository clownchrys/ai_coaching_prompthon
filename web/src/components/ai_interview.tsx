import Image from "next/image"
import { Button, Col, Row } from "antd";
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import reducer, {
    actions,
    type DirectiveOK,
    type DirectiveRetry,
    type ChatHistory,
    type ChatMessage,
    type DirectiveFailed,
    DirectiveType,
} from '@/reducers/interview';
import { useSelector } from 'react-redux';
// import { Dispatch } from 'redux';
import { RootState } from '@/reducers';
import { useDispatch } from "react-redux";

// speechsdk.Diagnostics.SetLoggingLevel(speechsdk.LogLevel.Debug);
// speechsdk.Diagnostics.StartConsoleOutput();

export type LLMFunction = (text: string) => string ;

const token = "5jYkN17W9sIClHszpJxriX6D2f0ScXQN0T2DQqDS51Pp55v9speqJQQJ99BBACNns7RXJ3w3AAAYACOGhNVE"
const region = "koreacentral"

const INIT_MESSAGE = "자, 지금부터 모의 면접을 시작하겠습니다. 안녕하세요?"

export default function AIInterview() {
    const dispatch = useDispatch()
    const interview_state = useSelector(( state: RootState ) => state.interview)
    console.log(interview_state)

    function stt() {
        const recognizer_config = speechsdk.SpeechConfig.fromSubscription(token, region);
        recognizer_config.speechRecognitionLanguage = "ko-KR"

        const speech_recognizer = new speechsdk.SpeechRecognizer(
            recognizer_config,
            speechsdk.AudioConfig.fromDefaultMicrophoneInput()
        );

        speech_recognizer.recognizeOnceAsync(
            (result): void => {
                let directive: DirectiveType;

                // 인식 성공
                if (result.reason == speechsdk.ResultReason.RecognizedSpeech) {
                    const { text } = result
                    directive = { text } as DirectiveOK
                    dispatch(
                        actions.set({
                            directive,
                            history: [
                                ...interview_state.history,
                                {speaker: "지원자", text}
                            ],
                            currentSpeaker: "면접관"
                        }
                    ))
                    console.log(`지원자: ${text}`)
                }
                // 잘 안들림
                else if (result.reason == speechsdk.ResultReason.NoMatch) {
                    directive = { count: 1 } as DirectiveRetry
                    dispatch(actions.set({ directive }))
                }
                // 취소 또는 에러
                // TODO: 이런 케이스에서 어떻게 할지 정의
                else if (result.reason == speechsdk.ResultReason.Canceled) {
                    if (speechsdk.CancellationDetails.fromResult(result).reason == speechsdk.CancellationReason.Error) {
                        directive = { type: "error" } as DirectiveFailed
                    } else {
                        directive = { type: "cancelled" } as DirectiveFailed
                    }
                    dispatch(actions.set({ directive }))
                }
                // Unexpected
                else {
                    console.log(`Unexpected case: ${result}`)
                    directive = { count: 1 } as DirectiveRetry
                    dispatch(actions.set({ directive }))
                }
            },
            (e) => {
                console.log(`Unexpected case: ${e}`)
                const directive: DirectiveRetry = { count: 1 }
                dispatch(actions.set({ directive }))
            },
        )
    }

    function tts(text: string) {
        const synthesizer_config = speechsdk.SpeechConfig.fromSubscription(token, region);
        synthesizer_config.speechSynthesisVoiceName = "ko-KR-BongJinNeural"

        const speech_synthesizer = new speechsdk.SpeechSynthesizer(
            synthesizer_config,
            speechsdk.AudioConfig.fromDefaultSpeakerOutput()
        );

        speech_synthesizer.speakTextAsync(
            text,
            (result): void => {
                if (result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted) {
                    dispatch(actions.set({
                        currentSpeaker: "지원자",
                        history: [
                            ...interview_state.history,
                            {speaker: "면접관", text}
                        ],
                        initialized: true
                    }))
                    console.log(`면접관: ${text}`)
                }
                else if (result.reason == speechsdk.ResultReason.Canceled) {
                    const cancellation_details = speechsdk.CancellationDetails.fromResult(result)
                    if (cancellation_details.errorDetails) {
                        console.log(`[SYSTEM] synthesizer error: ${JSON.stringify(result)}`)
                    } else {
                        console.log(`[SYSTEM] synthesizer cancelled: ${JSON.stringify(result)}`)
                    }
                }
                else {
                    console.log(`[SYSTEM] Unexpected case: ${JSON.stringify(result)}`)
                }
            },
            (e) => {
                console.log(`Unexpected case: ${e}`)
            },
        )
    }

    const onInterviewStart = () => {
        if (! interview_state.initialized) {
            tts(INIT_MESSAGE);
        }
        else if (interview_state.currentSpeaker == "면접관") {
            // call llm
            const generated = "llm calling..."
            tts(generated);
        }
        else {
            stt();
        }
    }

    return (
        <div>
            <Row gutter={ 24 } justify="space-between" align="stretch">
                <Col>
                    <Image src="/interviewer.jpeg" alt="Interviewer" width={ 400 } height={ 400 } />
                </Col>
                <Col span={14}>
                    <Image src="/interview_noti.jpg" alt="Interview Noti" width={ 600 } height={ 400 } />
                </Col>
            </Row>
            <Row gutter={ 24 } justify="end" align="stretch">
                <Col>
                    <Button
                        // color={ interview_state.currentSpeaker == "지원자" ? "danger" : "primary" }
                        type="primary"
                        htmlType="submit"
                        style={{ width: 100 }}
                        onClick={ onInterviewStart }
                    >
                        { ! interview_state.initialized && "시작하기"  }
                        { interview_state.initialized && `${interview_state.currentSpeaker} 차례` }
                    </Button>
                </Col>
            </Row>
        </div>
    )
}