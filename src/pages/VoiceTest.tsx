import "regenerator-runtime/runtime.js";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button, Input } from "@nextui-org/react";
import { useRef, useState } from "react";

const VoiceTest = () => {
  const commands = [
    {
      command: 'reset',
      callback: ({ transcript }) =>  { console.log("reset"); resetTranscript() }
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

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({ commands});

  const wineColorRef = useRef<HTMLInputElement>(null);

  const [wineColor, setWineColor] = useState<string>("");
  const [wineName, setWineName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  console.log("Transcript: ", transcript);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Is available: {isMicrophoneAvailable.toString()}</p>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <Button onClick={() => SpeechRecognition.startListening({ language: 'cs', continuous: true })}>Start</Button>
      <Button onClick={() => SpeechRecognition.stopListening()}>Stop</Button>
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
    </div>
  );
}

export default VoiceTest