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

export type LLMFunction = (text: string) => string ;

speechsdk.Diagnostics.SetLoggingLevel(speechsdk.LogLevel.Debug);
// speechsdk.Diagnostics.StartConsoleOutput();


export default class VoiceInterview {
    private llm: LLMFunction;
    private speech_recognizer: speechsdk.SpeechRecognizer
    private speech_synthesizer: speechsdk.SpeechSynthesizer
    // private dispatch: Dispatch

    constructor(
        llm: LLMFunction,
        recognizer_config: speechsdk.SpeechConfig,
        synthesizer_config: speechsdk.SpeechConfig,
        // dispatch: Dispatch
    ) {
        this.llm = llm;

        this.speech_recognizer = new speechsdk.SpeechRecognizer(
            recognizer_config,
            speechsdk.AudioConfig.fromDefaultMicrophoneInput()
        );
        
        // const audio_dest = new speechsdk.SpeakerAudioDestination();
        this.speech_synthesizer = new speechsdk.SpeechSynthesizer(
            synthesizer_config,
            // speechsdk.AudioConfig.fromSpeakerOutput(audio_dest)
            speechsdk.AudioConfig.fromDefaultSpeakerOutput()
        );

        // this.dispatch = dispatch
    }

    public iter(): void {
        
    }

    public stt(): void {
        this.speech_recognizer.recognizeOnceAsync(
            (result): void => {
                let directive: DirectiveType;
                // const InterviewState = useSelector(( state: RootState ) => state.interview)

                // 인식 성공
                if (result.reason == speechsdk.ResultReason.RecognizedSpeech) {
                    console.log(`면접자: ${result.text}`)
                    directive = { text: result.text } as DirectiveOK
                    const message: ChatMessage = {speaker: "interviewee", text: result.text}
                    // this.dispatch(
                    //     actions.set({
                    //         directive: directive,
                    //         history: [ ...InterviewState.history, message ]
                    //     }
                    // ))
                }
                // 잘 안들림
                else if (result.reason == speechsdk.ResultReason.NoMatch) {
                    directive = { count: 1 } as DirectiveRetry
                }
                // 취소 또는 에러
                // TODO: 이런 케이스에서 어떻게 할지 정의
                else if (result.reason == speechsdk.ResultReason.Canceled) {
                    if (speechsdk.CancellationDetails.fromResult(result).reason == speechsdk.CancellationReason.Error) {
                        directive = { type: "error" } as DirectiveFailed
                    } else {
                        directive = { type: "cancelled" } as DirectiveFailed
                    }
                }
                // Unexpected
                else {
                    console.log(`Unexpected case: ${result}`)
                    directive = { count: 1 } as DirectiveRetry
                }
            },
            (e) => {
                console.log(`Unexpected case: ${e}`)
                const directive: DirectiveRetry = { count: 1 }
                // this.dispatch(actions.set({ directive: directive }))
            },
        )
    }

    public tts(text: string): void {
        this.speech_synthesizer.speakTextAsync(
            text,
            (result): void => {
                if (result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted) {
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
}