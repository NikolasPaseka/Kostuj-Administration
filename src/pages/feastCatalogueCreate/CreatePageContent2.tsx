import { useEffect, useState } from "react"
import PrimaryButton from "../../components/PrimaryButton"
import CatalogueInputField from "./components/CatalogueInputField"
import { AtSymbolIcon, ClipboardDocumentIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { Winery } from "../../model/Winery";
import { axiosCall } from "../../communication/axios";
import { useAuth } from "../../context/AuthProvider";
import { Catalogue } from "../../model/Catalogue";
import WineryTable from "../../components/Tables/WineryTable";
import { UiStateType } from "../../communication/UiState";

type Props = { catalogue: Catalogue }

const CreatePageContent2 = ({ catalogue }: Props) => {
  const [adminsWineries, setAdminsWineries] = useState<Winery[]>([]);
  const [participatedWineries, setParticipatedWineries] = useState<Winery[]>([]);

  const [wineryEntry, setWineryEntry] = useState<Winery | null>( null);
  const [wineryTitle, setWineryTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [webAddress, setWebAddress] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const { accessToken, getUserData } = useAuth();

  useEffect(() => {
    const fetchAdminsWineries = async () => {
      const res: CommunicationResult<Winery[]> = await axiosCall(`/wineries/byAdmin`, "GET", undefined, accessToken ?? undefined);
      if (isSuccess(res)) {
        //setUiState({ type: UiStateType.SUCCESS })
        //setCatalogue(res.data);
        setAdminsWineries(res.data);
      } else {
        // setUiState({ 
        //   type: UiStateType.ERROR,
        //   message: res.message
        // })
      }
    }

    const fetchParticipatedWineries = async () => { 
      const res: CommunicationResult<Winery[]> = await axiosCall(`/catalogues/${catalogue.id}/wineries`, "GET", undefined, accessToken ?? undefined);
      if (isSuccess(res)) {
        setParticipatedWineries(res.data);
      }
    }
    
    fetchAdminsWineries();
    fetchParticipatedWineries();
  }, [accessToken, catalogue.id]);

  const onWinerySelectionChange = (key: React.Key | null) => {
    if (key === null) {
      return;
    }
    setWineryTitle((prevState) => {
      const selectedItem = adminsWineries.find((option) => option.id === key);
      const result = selectedItem?.name ?? prevState;
      if (selectedItem != null) {
        setWineryEntry(selectedItem);
        setEmail(selectedItem.email ?? "");
        setPhoneNumber(selectedItem.phoneNumber ?? "");
        setWebAddress(selectedItem.websitesUrl ?? "");
        setAddress(selectedItem.address ?? "");
      }
      return result;
    });
  }

  const isWineryNew = () => { return adminsWineries.find((winery) => winery.name == wineryTitle) == null; }

  const createNewWinery = () => {
    const newWinery: Winery = {
      id: "",
      name: wineryTitle,
      email: email,
      phoneNumber: phoneNumber,
      websitesUrl: webAddress,
      address: address,
      adminId: getUserData()?.id ?? "",
      isPublic: false
    }
    // TODO sent post request
    setWineryEntry(newWinery);
    addParticipatedWinery(newWinery);
  }

  const addParticipatedWinery = async (winery: Winery | null) => {
    if (winery == null) { return; }

    const res: CommunicationResult<object> = await axiosCall(`/catalogues/${catalogue.id}/wineries`, "POST", winery, accessToken ?? undefined);
    if (isSuccess(res)) { 
      setParticipatedWineries([...participatedWineries, winery]);
      setWineryEntry(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Autocomplete 
        allowsCustomValue
        label="Winery" 
        placeholder="Select or enter winery name"
        inputValue={wineryTitle}
        onInputChange={setWineryTitle}
        selectedKey={wineryTitle}
        onSelectionChange={onWinerySelectionChange}
        isRequired
        variant="faded"
        labelPlacement="outside"
        defaultItems={adminsWineries}
        description={
          wineryTitle.length > 0 && !isWineryNew() ? (
            <p className="text-green-400">Selected winery</p>
          ) : wineryTitle.length > 0 ? (
            <p className="text-red-400">Creating new winery</p>
          ) : ( "" )
        }
        startContent={<ClipboardDocumentIcon className="w-5 h-5 text-gray-600" /> }
      >
        {(item) => <AutocompleteItem key={item.id ?? ""}>{item.name}</AutocompleteItem>}
      </Autocomplete>

      <div className="flex flex-row gap-4">
        <CatalogueInputField
          value={email}
          isDisabled={!isWineryNew()}
          onValueChange={setEmail}
          label="Feast Year" 
          placeholder="Enter feast year" 
          StartContent={AtSymbolIcon}
        />

        <CatalogueInputField 
          value={phoneNumber} 
          isDisabled={!isWineryNew()}
          onValueChange={setPhoneNumber} 
          label="Phone Number" 
          placeholder="Input Address"
          StartContent={MapPinIcon}
        />
      </div>
      <div className="flex flex-row gap-4">
        <CatalogueInputField 
          value={webAddress} 
          isDisabled={!isWineryNew()}
          onValueChange={setWebAddress} 
          label="Phone Number" 
          placeholder="Input Address"
          StartContent={MapPinIcon}
        />

        <CatalogueInputField 
          value={address} 
          isDisabled={!isWineryNew()}
          onValueChange={setAddress} 
          label="Address" 
          placeholder="Input Address"
          StartContent={MapPinIcon}
        />
      </div>

      {/* TODO CALL EDIT */}
      <PrimaryButton 
        className="w-32 ml-auto" 
        onClick={isWineryNew() ? createNewWinery : () => addParticipatedWinery(wineryEntry)}
      >
        {isWineryNew() ? "Create and add" : "Add Winery"}
      </PrimaryButton>

      <WineryTable wineries={participatedWineries} uiState={{ type: UiStateType.SUCCESS }} />
    </div>
  )
}

export default CreatePageContent2