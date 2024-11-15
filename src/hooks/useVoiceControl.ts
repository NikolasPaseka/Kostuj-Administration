import "regenerator-runtime/runtime.js";
import { useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useVoiceControl = (actionAfterVoiceInput: () => Promise<void>, commands?: any) => {
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
      isMicrophoneAvailable
    } = useSpeechRecognition({ commands });

    const [startTime, setStartTime] = React.useState<number>(0);

    const startListening = () => { SpeechRecognition.startListening({ language: 'cs', continuous: true }) }
    const stopListening =  () => { SpeechRecognition.stopListening() }
  
    const silenceTimerRef = useRef<number | null>(null);
  
    const resetSilenceTimer = async () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      setStartTime((new Date()).getTime());
      silenceTimerRef.current = setTimeout(async () => {
        console.log("Silence detected");
        actionAfterVoiceInput();
        resetTranscript();
      }, 1500);
    };
  
    useEffect(() => {
      if (transcript.length !== 0) {
        console.log("Transcript: ", transcript);
        resetSilenceTimer();
      }
    }, [transcript]);
  
    return {
      transcript,
      startListening,
      stopListening,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
      isMicrophoneAvailable,
      remainingTime: ((1500 - ((new Date()).getTime() - startTime)) / 1500) * 100,
    };
  };
  
  export default useVoiceControl;