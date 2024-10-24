import { MicrophoneIcon } from "@heroicons/react/24/solid"
import PrimaryButton from "./PrimaryButton"

type Props = {
  startListening: () => void;
  stopListening: () => void;
  listening: boolean;
}

const VoiceInputButton = ({ startListening, stopListening, listening }: Props) => {

  return (
    <PrimaryButton 
      onClick={listening ? stopListening : startListening}
      className={`w-16 h-16 fixed bottom-8 right-8 z-50 rounded-full 
        ${listening ? 'bg-tertiary animate-glow' : 'bg-lightContainer'}`}
    >
      <MicrophoneIcon className="w-8 h-8 text-black" />
    </PrimaryButton>
  )
}

export default VoiceInputButton