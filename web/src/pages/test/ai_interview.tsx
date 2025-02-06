import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

// import { useDispatch } from 'react-redux';
import VoiceInterview, { LLMFunction } from '@/common/interview';
import { Button } from 'antd';

const token = "5jYkN17W9sIClHszpJxriX6D2f0ScXQN0T2DQqDS51Pp55v9speqJQQJ99BBACNns7RXJ3w3AAAYACOGhNVE"
const region = "koreacentral"
const llm: LLMFunction = (text) => "123123123"

export default function Test() {
    // const dispatch = useDispatch();

    const recognizer_config = speechsdk.SpeechConfig.fromSubscription(token, region);
    recognizer_config.speechRecognitionLanguage = "ko-KR"

    const synthesizer_config = speechsdk.SpeechConfig.fromSubscription(token, region);
    synthesizer_config.speechSynthesisVoiceName = "ko-KR-BongJinNeural"

    const interview = new VoiceInterview(
        llm,
        recognizer_config,
        synthesizer_config,
        // dispatch
    )
    // interview.tts("자, 지금부터 모의 면접을 시작하겠습니다. 안녕하세요?")

    return (
        <div>
            Hello, World
            <Button onClick={() => {interview.stt()}}>
                Click!!!!!!!
            </Button>
        </div>
    )
}