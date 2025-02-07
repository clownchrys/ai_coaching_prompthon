from typing import *
import json
import os

from openai import AzureOpenAI
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk

load_dotenv()

# TODO: llm 용 클라이언트
client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT","").strip(),
    api_key        = os.getenv("AZURE_OPENAI_API_KEY"),
    api_version    = os.getenv("OPENAI_API_VERSION")
)

deployment_name    = os.getenv('DEPLOYMENT_NAME')
speech_key         = os.getenv("AZURE_SPEECH_KEY")         # Azure Speech Service의 Speech Key입니다.
speech_region      = os.getenv("AZURE_SPEECH_REGION")      # Azure Speech Service의 서비스 지역입니다.
speech_language    = os.getenv("AZURE_SPEECH_LANGUAGE")    # Azure Speech Service의 서비스 언어입니다.


class BaseDirective: pass

class DirectiveOK(BaseDirective):
    def __init__(self, text: str):
        self.text = text

class DirectiveRetry(BaseDirective):
    def __init__(self, count: int = 1):
        self.count = count

class DirectiveFailed(BaseDirective):
    def __init__(self, case: Literal["error", "cancelled"]):
        self.case = case


class VoiceInterview:
    def __init__(
        self,
        llm: Callable[[str], str],
        recognizer_config: speechsdk.SpeechConfig,
        synthesizer_config: speechsdk.SpeechConfig,
    ):
        """
        recognizer_config = speechsdk.SpeechConfig(
            subscription=speech_key,
            region=speech_region,
            speech_recognition_language='ko-KR'
        )

        synthesizer_config = speechsdk.SpeechConfig(
            subscription=speech_key,
            region=speech_region,
            speech_synthesis_voice_name="ko-KR-BongJinNeural"
        )
        """
        self.llm = llm
        self.speech_recognizer = speechsdk.SpeechRecognizer(speech_config=recognizer_config)
        self.speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=synthesizer_config)

    def start(self):
        print("면접 시작!")
        self.tts("자, 지금부터 모의 면접을 시작하겠습니다. 안녕하세요?")

        while True:
            directive = self.stt()

            if type(directive) == DirectiveOK:
                if directive.text in ("종료", "나가기"):
                    break
                generated = self.llm(directive.text)
                self.tts(generated)

            elif type(directive) == DirectiveRetry:
                self.tts("다시 말씀해주시겠어요?")

            elif type(directive) == DirectiveFailed:
                self.tts("예상치 못한 문제로 취소 또는 종료되었습니다.")
                break

    def stt(self) -> BaseDirective:
        result = self.speech_recognizer.recognize_once()

        # 인식 성공
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            print("Interviewee: ", result.text)
            return DirectiveOK(result.text)

        # 잘 안들림
        elif result.reason == speechsdk.ResultReason.NoMatch:
            return DirectiveRetry()

        # 취소 또는 에러
        # TODO: 이러한 케이스에서 어떻게 할지?
        elif result.reason == speechsdk.ResultReason.Canceled:
            # 에러
            if result.cancellation_details.reason == speechsdk.CancellationReason.Error:
                return DirectiveFailed("error")
            # 취소
            else:
                return DirectiveFailed("cancelled")

        # Unexpected
        else:
            print("Unexpected case: ", result)
            return DirectiveRetry()

    def tts(self, text: str):
        """
        Set the voice name,
        refer to https://learn.microsoft.com/ko-kr/azure/ai-services/speech-service/language-support?tabs=tts for full list.
        """
        result = self.speech_synthesizer.speak_text_async(text).get()

        # 변환 성공
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("Interviewer: ", text)

        # 실패 또는 취소
        elif result.reason == speechsdk.ResultReason.Canceled:
            if result.cancellation_details.error_details:
                print("[SYSTEM] synthesizer error: ", result.cancellation_details.error_details)
            else:
                print("[SYSTEM] synthesizer cancelled: ", result.cancellation_details.reason)

        # Unexpected
        else:
            print("Unexpected case: ", result)


def gpt(input):
    messages = [
        {"role": "user", "content": input}
    ]
    assistant_response = run_conversation(messages, deployment_name)
    # assistant_response 값이 비어있을 경우
    # print(assistant_response)
    if not assistant_response:
        return "제가 답변 드릴 수 있는 질문이 아닙니다. 다시 질문해주세요."
    else:
        content = json.dumps(assistant_response.choices[0].message.content, ensure_ascii=False, indent=4)
        content = content.replace("\\n", "\n").replace("\\\"", "\"")
        return content

def run_conversation(messages, deployment_name):
    # Step 1: send the conversation and available functions to GPT
    response = client.chat.completions.create(
        model = deployment_name,
        messages = messages,
    )
    return response


def main():
    recognizer_config = speechsdk.SpeechConfig(
        subscription=speech_key,
        region=speech_region,
        speech_recognition_language="ko-KR"
    )
    synthesizer_config = speechsdk.SpeechConfig(
        subscription=speech_key,
        region=speech_region,
    )
    synthesizer_config.speech_synthesis_voice_name = "ko-KR-BongJinNeural"

    interview = VoiceInterview(
        llm=gpt,
        recognizer_config=recognizer_config,
        synthesizer_config=synthesizer_config,
    )
    interview.start()


if __name__ == "__main__":
    main()
