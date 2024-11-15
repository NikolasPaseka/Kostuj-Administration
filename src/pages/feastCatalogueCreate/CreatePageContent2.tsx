import { useEffect, useMemo, useState } from "react"
import PrimaryButton from "../../components/PrimaryButton"
import CatalogueInputField from "./components/CatalogueInputField"
import { AtSymbolIcon, ChevronRightIcon, ClipboardDocumentIcon, MapPinIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Accordion, AccordionItem, Autocomplete, AutocompleteItem, Divider, useDisclosure } from "@nextui-org/react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { Winery } from "../../model/Winery";
import { Catalogue } from "../../model/Catalogue";
import WineryTable from "../../components/Tables/WineryTable/WineryTable";
import { resolveUiState, UiState, UiStateType } from "../../communication/UiState";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "../../translations/i18n";
import ImageSlider from "../../components/ImageSlider";
import ImageUploader from "../../components/ImageUploader";
import { WineryRepository } from "../../communication/repositories/WineryRepository";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { useAuth } from "../../context/AuthProvider";
import useVoiceControl from "../../hooks/useVoiceControl";
import VoiceInputButton from "../../components/VoiceInputButton";
import { VoiceControlRepository } from "../../communication/repositories/VoiceControlRepository";
import { WineryDomainUtil } from "../../model/Domain/WineryDomainUtil";
import ModalDialog from "../../components/ModalDialog";
import UiStateHandler from "../../components/UiStateHandler";

type Props = { catalogue: Catalogue }

const CreatePageContent2 = ({ catalogue }: Props) => {
  const { t } = useTranslation();
  const { getUserData } = useAuth();
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [uiStateParticipated, setUiStateParticipated] = useState<UiState>({ type: UiStateType.LOADING });

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [adminsWineries, setAdminsWineries] = useState<Winery[]>([]);
  const [participatedWineries, setParticipatedWineries] = useState<Winery[]>([]);

  const wineriesForSelection = useMemo(() => {
    return adminsWineries.filter((winery) => !participatedWineries.some((participatedWinery) => participatedWinery.id === winery.id));
  }, [adminsWineries, participatedWineries]);

  const [wineryEntry, setWineryEntry] = useState<Winery | null>( null);
  const [wineryTitle, setWineryTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [webAddress, setWebAddress] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [image, setImage] = useState<string | null>();
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);

  const [importWineriesSelection, setImportWineriesSelection] = useState<Winery[]>([]);

  useEffect(() => {
    const fetchAdminsWineries = async () => {
      const res: CommunicationResult<Winery[]> = await WineryRepository.getAdminsWineries();
      setAdminsWineries(resolveUiState(res, setUiState) ?? []);
    }

    const fetchParticipatedWineries = async () => { 
      const res: CommunicationResult<Winery[]> = await CatalogueRepository.getParticipatedWineries(catalogue);
      setParticipatedWineries(resolveUiState(res, setUiStateParticipated) ?? []);
    }
    
    fetchAdminsWineries();
    fetchParticipatedWineries();
  }, [catalogue]);

  const onWinerySelectionChange = (key: React.Key | null) => {
    if (key === null) {
      return;
    }

    const selectedItem = adminsWineries.find((option) => option.id === key);
    if (selectedItem != null) {
      setWineryTitle(selectedItem.name);
      setWineryEntry(selectedItem);
      setEmail(selectedItem.email ?? "");
      setPhoneNumber(selectedItem.phoneNumber ?? "");
      setWebAddress(selectedItem.websitesUrl ?? "");
      setAddress(selectedItem.address ?? "");
    }
  }

  const isWineryNew = () => { return adminsWineries.find((winery) => winery.name == wineryTitle && winery.address == address) == null; }

  const createNewWinery = () => {
    const newWinery: Winery = WineryDomainUtil.createWineryEntry(wineryTitle, email, phoneNumber, webAddress, address, getUserData()?.id ?? "");
    setWineryEntry(newWinery);
    addParticipatedWinery(newWinery);
  }

  const addParticipatedWinery = async (winery: Winery | null) => {
    if (winery == null) { return; }

    const res: CommunicationResult<Winery> = await CatalogueRepository.addParticipatedWinery(catalogue, winery);
    if (isSuccess(res)) { 
      setParticipatedWineries([...participatedWineries, res.data]);
      if (isWineryNew()) {
        uploadImage(imageToUpload, res.data.id);
      }
      clearInputData();
    }
  }

  const addParticipatedWineries = async (wineries: Winery[]) => {
    const res: CommunicationResult<Winery[]> = await CatalogueRepository.addParticipatedWineries(catalogue, wineries);
    if (isSuccess(res)) {
      setParticipatedWineries([...participatedWineries, ...res.data]);
    }
  }

  const uploadImage = async (file: File | null, wineryId: string) => {
    if (file == null) { return; }

    const res: CommunicationResult<string> = await WineryRepository.uploadImage(wineryId, file);
    if (isSuccess(res) && wineryEntry != null) {
      setWineryEntry({ ...wineryEntry, imageUrl: res.data });
    }
  };

  const deleteImage = async (imageUrl: string) => {
    if (wineryEntry == null) {
      setImageToUpload(null);
      setImage(null);
      return; 
    }

    const res: CommunicationResult<SuccessMessage> = await WineryRepository.deleteImage(wineryEntry.id, imageUrl);
    if (isSuccess(res)) {
      setWineryEntry({ ...wineryEntry, imageUrl: undefined});
    }
  }

  const removeWineryFromParticipated = async (winery: Winery) => {
    const res: CommunicationResult<SuccessMessage> = await CatalogueRepository.removeWineryFromParticipated(catalogue, winery);
    if (isSuccess(res)) {
      setParticipatedWineries([ ...participatedWineries.filter(w => w.id !== winery.id)]);
    }
  }

  const areRequiredFieldsFilled = !wineryTitle.isEmpty() && !address.isEmpty();

  const clearInputData = () => {
    setWineryEntry(null);
    setWineryTitle("");
    setEmail("");
    setPhoneNumber("");
    setWebAddress("");
    setAddress("");
    setImage(null);
    setImageToUpload(null);
  }

  const sendVoiceInput = async () => {
    if (transcript.length == 0) { return; }
    const resWinery = await VoiceControlRepository.sendWineryRequest(transcript);
    console.log(resWinery);
    if (isSuccess(resWinery)) {
      const winery: Winery = (resWinery.data as { entity: Winery }).entity;
      if (winery.name != null) { setWineryTitle(winery.name); }
      if (winery.email != null) { setEmail(winery.email); }
      if (winery.phoneNumber != null) { setPhoneNumber(winery.phoneNumber); }
      if (winery.websitesUrl != null) { setWebAddress(winery.websitesUrl); }
      if (winery.address != null) { setAddress(winery.address); }
    }
  }

  const {
    transcript,
    startListening,
    stopListening,
    listening,
  } = useVoiceControl(sendVoiceInput);

  return (
    <div className="flex flex-col gap-4">
      <UiStateHandler uiState={uiState} />
      <PrimaryButton
        onClick={onOpen}
        isSecondary
        className="w-auto ml-auto"
        EndContent={ChevronRightIcon}
      >
        Pair your wineries to catalogue
      </PrimaryButton>
      <Accordion
        variant="bordered"
        className="my-2"
      >
        <AccordionItem 
          aria-label="Accordion" 
          title="Create new wineries for catalogue"
          subtitle={
            <span>
              Press to show form for creating <strong>new wineries</strong>
            </span>
          }
          startContent={<PlusIcon className='w-5 h-5 text-secondary' />
        }>
        <div className="flex flex-row gap-4">
          <div className="flex-1 flex flex-col gap-4">
          <Autocomplete 
            allowsCustomValue
            label={t("winery", { ns: TranslationNS.catalogues })}
            placeholder={t("wineryPlaceholder", { ns: TranslationNS.catalogues })}
            inputValue={wineryTitle}
            onInputChange={setWineryTitle}
            onSelectionChange={onWinerySelectionChange}
            isRequired
            variant="faded"
            defaultItems={wineriesForSelection}
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
              isRequired 
              value={address}
              //isDisabled={!isWineryNew()}
              onValueChange={setAddress} 
              label={t("placeAndAddress", { ns: TranslationNS.catalogues })}
              placeholder={t("placeAndAddressPlaceholder", { ns: TranslationNS.catalogues })}
              StartContent={MapPinIcon}
            />

            <CatalogueInputField
              value={email}
              isDisabled={!isWineryNew()}
              onValueChange={setEmail}
              label={t("emailAddress", { ns: TranslationNS.catalogues })} 
              placeholder={t("emailAddressPlaceholder", { ns: TranslationNS.catalogues })}
              StartContent={AtSymbolIcon}
            />

          </div>
          <div className="flex flex-row gap-4">
            <CatalogueInputField 
              value={webAddress} 
              isDisabled={!isWineryNew()}
              onValueChange={setWebAddress} 
              label="Web Address" 
              placeholder="Input Web Address"
              StartContent={MapPinIcon}
            />

            <CatalogueInputField 
              value={phoneNumber} 
              isDisabled={!isWineryNew()}
              onValueChange={setPhoneNumber} 
              label={t("phoneNumber", { ns: TranslationNS.catalogues })}
              placeholder={t("phoneNumberPlaceholder", { ns: TranslationNS.catalogues })}
              StartContent={MapPinIcon}
            />
          </div>

          <VoiceInputButton 
            startListening={startListening}
            stopListening={stopListening}
            listening={listening}
          />

          {transcript}
          {/* TODO CALL EDIT */}
          <PrimaryButton 
            className="ml-auto"
            isDisabled={!areRequiredFieldsFilled}
            onClick={isWineryNew() ? createNewWinery : () => addParticipatedWinery(wineryEntry)}
          >
            {isWineryNew() 
              ? t("createAndAddWinery", { ns: TranslationNS.catalogues })
              : t("addWinery", { ns: TranslationNS.catalogues })
            }
          </PrimaryButton>
          </div>
          <div className="flex flex-col gap-6 basis-[25%]">
            <div className="h-[30rem]">
              <ImageSlider 
                imageUrls={isWineryNew() ? [image ?? ""] : [wineryEntry?.imageUrl ?? ""]} 
                onDelete={deleteImage}
                />
            </div>
            
            <ImageUploader
              isMultiple={false}
              onSelect={data => {
                if (isWineryNew()) { 
                  setImage(data.previewUrls[0]);
                  setImageToUpload(data.files[0]);
                } else if (wineryEntry != null) {
                  uploadImage(data.files[0], wineryEntry.id);
                }
              }}
            />
          </div>
        </div>
        </AccordionItem>
      </Accordion>
      
      <Divider />

      <WineryTable 
        wineries={participatedWineries} 
        uiState={uiStateParticipated}
        removeWineryFromParticipated={removeWineryFromParticipated}
      />

      <ModalDialog 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        header={"Add participants from your wineries"}
        onConfirm={() => {
          addParticipatedWineries(importWineriesSelection);
        }}
        scrollBehavior="inside"
        size="5xl"
      >
        <WineryTable
          wineries={adminsWineries.filter(w => !participatedWineries.some(p => p.id === w.id))}
          uiState={uiState}
          isSelectable={true}
          onSelectionChange={setImportWineriesSelection}
          selectedWineries={importWineriesSelection}
        />
      </ModalDialog>
    </div>
  )
}

export default CreatePageContent2