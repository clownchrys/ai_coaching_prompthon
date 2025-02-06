import azure.cognitiveservices.speech as speechsdk
import os
from openai import AzureOpenAI
import json
import requests
import pytz
from urllib import parse
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT","").strip(),
    api_key        = os.getenv("AZURE_OPENAI_API_KEY"),
    api_version    = os.getenv("OPENAI_API_VERSION")
)

deployment_name    = os.getenv('DEPLOYMENT_NAME')
speech_key         = os.getenv("AZURE_SPEECH_KEY")         # Azure Speech Service의 Speech Key입니다.
speech_region      = os.getenv("AZURE_SPEECH_REGION")      # Azure Speech Service의 서비스 지역입니다.
speech_language    = os.getenv("AZURE_SPEECH_LANGUAGE")    # Azure Speech Service의 서비스 언어입니다.

# Azure Cognitive Speech to Text 함수
def stt():
    # Creates a recognizer with the given settings
    # Azure STT & TTS API key
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region, speech_recognition_language='ko-KR')
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)

    print("말씀 하세요~")

    # Starts speech recognition, and returns after a single utterance is recognized. The end of a
    # single utterance is determined by listening for silence at the end or until a maximum of 15
    # seconds of audio is processed.
    result = speech_recognizer.recognize_once()

    # Checks result.
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("음성인식결과: {}".format(result.text))
    elif result.reason == speechsdk.ResultReason.NoMatch:
        print("일치하는 음성이 없습니다.: {}".format(result.no_match_details))
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("음성 인식이 취소되었습니다.: {}".format(
            cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            if cancellation_details.error_details:
                print("Error details: {}".format(
                    cancellation_details.error_details))
    return result

# Azure Cognitive Text to Speech 함수
def tts(input):
    # Set the voice name, refer to https://learn.microsoft.com/ko-kr/azure/ai-services/speech-service/language-support?tabs=tts for full list.
    # speech_config.speech_synthesis_voice_name = "ko-KR-InJoonNeural"
    # Creates a synthesizer with the given settings
    # Azure STT & TTS API key
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
    speech_config.speech_synthesis_voice_name = "ko-KR-BongJinNeural"
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)

    # Synthesizes the received text to speech.
    result = speech_synthesizer.speak_text_async(input).get()

    # Checks result.
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Speech synthesized to speaker for text [{}]".format(input))
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech synthesis canceled: {}".format(
            cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            if cancellation_details.error_details:
                print("Error details: {}".format(
                    cancellation_details.error_details))
        print("Did you update the subscription info?")


def gpt(input):
    messages = [
        {"role": "user", "content": input}
    ]
    assistant_response = run_conversation(messages, deployment_name)
    # assistant_response 값이 비어있을 경우
    print(assistant_response)
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
    tts("날씨, 길찾기, 시간을 물어보세요.")

    while True:
        result_stt = stt().text
        print(result_stt)
        if(result_stt == ""):
            # 음성 인식 실패
            print("음성 인식 실패")
            tts("음성인식에 실패했습니다. 다시 말씀해 주세요.")
        elif(result_stt == "나가기." or result_stt == "종료."):
            print("대화 종료")
            break
        else:
            # 음성인식 성공
            result_gpt = gpt(result_stt)
            tts(result_gpt)
if __name__ == "__main__":
    main()