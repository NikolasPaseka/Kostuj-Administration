import { useState } from "react"
import PrimaryButton from "../../components/PrimaryButton"
import CatalogueInputField from "./components/CatalogueInputField"
import { AtSymbolIcon, ClipboardDocumentIcon, MapPinIcon } from "@heroicons/react/24/solid";

const CreatePageContent2 = () => {
  const [wineryTitle, setWineryTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [webAddress, setWebAddress] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  return (
    <div className="flex flex-col gap-4">
      <CatalogueInputField
        value={wineryTitle}
        onValueChange={setWineryTitle}
        isRequired 
        label="Catalogue Title" 
        placeholder="Enter catalogue title" 
        StartContent={ClipboardDocumentIcon}
      />
      <div className="flex flex-row gap-4">
        <CatalogueInputField
          value={email}
          onValueChange={setEmail}
          label="Feast Year" 
          placeholder="Enter feast year" 
          StartContent={AtSymbolIcon}
        />

        <CatalogueInputField 
          value={phoneNumber} 
          onValueChange={setPhoneNumber} 
          label="Phone Number" 
          placeholder="Input Address"
          StartContent={MapPinIcon}
        />
      </div>
      <div className="flex flex-row gap-4">
        <CatalogueInputField 
          value={webAddress} 
          onValueChange={setWebAddress} 
          label="Phone Number" 
          placeholder="Input Address"
          StartContent={MapPinIcon}
        />

        <CatalogueInputField 
          value={address} 
          onValueChange={setAddress} 
          label="Address" 
          placeholder="Input Address"
          StartContent={MapPinIcon}
        />
      </div>

      {/* TODO CALL EDIT */}
      <PrimaryButton 
        className="w-32 ml-auto" 
        onClick={() => {}}
      >
        Add Winery
      </PrimaryButton>
    </div>
  )
}

export default CreatePageContent2