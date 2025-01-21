import { Button, Input } from "@heroui/react";
import { useRef, useState } from "react";
import GenericInput from "../components/GenericInput";
import PrimaryButton from "../components/PrimaryButton";
import { axiosCall } from "../communication/axios";
import { isSuccess } from "../communication/CommunicationsResult";
import { Winery } from "../model/Winery";
import useVoiceControl from "../hooks/useVoiceControl";
import VerticalStepIndicator from "../components/VerticalStepIndicator";

const VoiceTest = () => {
  const commands = [
    {
      command: 'reset',
      callback: () => { console.log("reset"); resetTranscript() }
    },
    {
      command: 'barva vína *',
      callback: (color: string) => { 
        console.log("barva vína: ", color); 
        wineColorRef.current?.focus();
        setWineColor(color); 
      }
    },
    {
      command: ['název vzorku :name', 'vzorek :name'],
      callback: (name: string) => { console.log("nazev vzorku: ", name); setWineName(name.toUpperCase()); },
    },

    {
      command: ['telefonní číslo :name', 'číslo '],
      callback: (phone: string) => { console.log("nazev vzorku: ", name); setPhone(phone.toUpperCase()); },
    },

    {
      command: ['email :name'],
      callback: (name: string) => { console.log("nazev vzorku: ", name); setEmail(name); },
    },
  ]
  const wineColorRef = useRef<HTMLInputElement>(null);

  const [wineColor, setWineColor] = useState<string>("");
  const [wineName, setWineName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // NER testing
  const [sentence, setSentence] = useState<string>("");
  const [sentenceWinery, setSentenceWinery] = useState<string>("");
  const [sentenceResult, setSentenceResult] = useState<{ winery: string, wine: string, year: string, color: string, rating: string} | null>(null);
  const [wineryResult, setWineryResult] = useState<Winery | null>(null);

  const sendWineSentenceRequest = async () => {
    const val = transcript.length != 0 ? transcript : sentence;
    const res = await axiosCall("POST", "/ner", { sentence: val }, undefined, "application/json", "http://localhost:8000");
    console.log(res);
    if (isSuccess(res)) {
      setSentenceResult((res.data as { entity: {
        winery: string,
        wine: string,
        year: string,
        color: string
        rating: string
      } }).entity);

      const wineColor = (res.data as { entity: { color: string } }).entity.color;
      if (wineColor) {
        wineColorRef.current?.focus();  
        setWineColor(wineColor);
      }
    }
  }

  const {
    transcript,
    startListening,
    stopListening,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useVoiceControl(sendWineSentenceRequest, commands);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Is available: {isMicrophoneAvailable.toString()}</p>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <Button onClick={() => startListening()}>Start</Button>
      <Button onClick={() => stopListening()}>Stop</Button>
      <Button onClick={resetTranscript}>Reset</Button>

      <p>{transcript}</p>

      <Input
        ref={wineColorRef}
        type="text"
        variant="bordered"
        color="secondary"
        value={wineColor}
        onChange={(e) => setWineColor(e.target.value)}
      />
      <Input
        type="text"
        value={wineName}
        onChange={(e) => setWineName(e.target.value)}
      />      
      <Input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <Input
        type="text"
        value={email}
        onChange={(e) => setPhone(e.target.value)}
      />

      <GenericInput
        label={"Sentence"}
        value={sentence}
        onChange={setSentence}
      />

      <GenericInput
        label={"Winery sentence"}
        value={sentenceWinery}
        onChange={setSentenceWinery}
      />

      <p>{transcript}</p>
      <PrimaryButton
        onClick={async () => {
          sendWineSentenceRequest()

          console.log("Winery sentence: ", sentenceWinery);
          const resWinery = await axiosCall("POST", "/ner/winery", { sentence: sentenceWinery }, undefined, "application/json", "http://localhost:8000");
          console.log(resWinery);
          if (isSuccess(resWinery)) {
            setWineryResult((resWinery.data as { entity: Winery }).entity);
          }
        }}
      >
        Send
      </PrimaryButton>
      <div className="flex flex-1">
        <div className="flex-1">
          <b>Wine</b>
          {sentenceResult && <div>
            <p>Winery: {sentenceResult.winery}</p>
            <p>Wine: {sentenceResult.wine}</p>
            <p>Color: {sentenceResult.color}</p>
            <p>Year: {sentenceResult.year}</p>
            <p>Rating: {sentenceResult.rating}</p>
          </div>}
        </div>
        <div className="flex-1">
          <b>Winery</b>
          {wineryResult && <div>
            <p>Winery: {wineryResult.name}</p>
            <p>address: {wineryResult.address}</p>
            <p>email: {wineryResult.email}</p>
            <p>phone: {wineryResult.phoneNumber}</p>
            <p>web: {wineryResult.websitesUrl}</p>
          </div>}
        </div>
      </div>
      <VerticalStepIndicator currentStep={3} />
    </div>
  );
}

export default VoiceTest