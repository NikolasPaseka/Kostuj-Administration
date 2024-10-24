import "regenerator-runtime/runtime.js";
import { useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const useVoiceControl = (actionAfterVoiceInput: () => Promise<void>, commands?: any, ) => {
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
      isMicrophoneAvailable
    } = useSpeechRecognition({ commands });

    const startListening = () => { SpeechRecognition.startListening({ language: 'cs', continuous: true }) }
    const stopListening =  () => { SpeechRecognition.stopListening() }
  
    const silenceTimerRef = useRef<number | null>(null);
  
    const resetSilenceTimer = async () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      silenceTimerRef.current = setTimeout(async () => {
        console.log("Silence detected");
        await actionAfterVoiceInput();
        resetTranscript();
      }, 1500);
    };
  
    useEffect(() => {
      if (transcript.length !== 0) {
        console.log("Transcript eff: ", transcript);
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
      isMicrophoneAvailable
    };
  };
  
  export default useVoiceControl;