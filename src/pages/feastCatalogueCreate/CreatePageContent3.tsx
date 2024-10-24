import { useEffect, useState } from "react"
import PrimaryButton from "../../components/PrimaryButton"
import CatalogueInputField from "./components/CatalogueInputField"
import { ClipboardDocumentIcon, MicrophoneIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Autocomplete, AutocompleteItem, Divider, Radio, RadioGroup, Slider } from "@nextui-org/react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { Winery } from "../../model/Winery";
import { Catalogue } from "../../model/Catalogue";
import { UiStateType } from "../../communication/UiState";
import { WineSample } from "../../model/WineSample";
import { getWineSearchName, Wine } from "../../model/Wine";
import WineTable from "../../components/Tables/WineTable";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "../../translations/i18n";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { WineryRepository } from "../../communication/repositories/WineryRepository";
import { WineColor } from "../../model/Domain/WineColor";
import { axiosCall } from "../../communication/axios";
import useVoiceControl from "../../hooks/useVoiceControl";
import VoiceInputButton from "../../components/VoiceInputButton";

type Props = { catalogue: Catalogue }

const CreatePageContent3 = ({ catalogue }: Props) => {
  const { t } = useTranslation();

  const [participatedWineries, setParticipatedWineries] = useState<Winery[]>([]);
  const [selectedWinery, setSelectedWinery] = useState<Winery | null>(null);
  const [wineryWines, setWineryWines] = useState<Wine[]>([]);

  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [wineSamples, setWineSamples] = useState<WineSample[]>([]);

  const [wineName, setWineName] = useState<string>("");
  const [sampleName, setSampleName] = useState<string>("");
  const [wineYear, setWineYear] = useState<number | null>(null);
  const [sampleRating, setSampleRating] = useState<number | null>(null);
  const [wineColor, setWineColor] = useState<string>("");
  const [residualSugar, setResidualSugar] = useState<number | null>(null);
  const [alcoholContent, setAlcoholContent] = useState<number | null>(null);
  const [acidity, setAcidity] = useState<number | null>(null);
  const [grapeSweetness, setGrapeSweetness] = useState<number | null>(null);

  useEffect(() => {
    const fetchParticipatedWineries = async () => { 
      const res: CommunicationResult<Winery[]> = await CatalogueRepository.getParticipatedWineries(catalogue);
      if (isSuccess(res)) {
        setParticipatedWineries(res.data);
      }
    }

    const fetchAddedWineSamples = async () => {
      const res: CommunicationResult<WineSample[]> = await CatalogueRepository.getSamples(catalogue.id);
      if (isSuccess(res)) {
        setWineSamples(res.data);
      }
    }
    
    fetchParticipatedWineries();
    fetchAddedWineSamples();
  }, [catalogue]);

  const fetchWineryWines = async (winery: Winery) => {
    const res: CommunicationResult<Wine[]> = await WineryRepository.getWineryWines(winery.id);
    if (isSuccess(res)) {
      setWineryWines(res.data);
    }
  }

  const onWinerySelectionChange = (key: React.Key | null) => {
    if (key === null) { return; }
    setSelectedWinery((prevState) => {
      const selectedItem = participatedWineries.find((option) => option.id === key);
      const result = selectedItem ?? prevState;
      if (result != null) {
        fetchWineryWines(result);
      }
      return result;
    });
  }

  const onWineSelectionChange = (key: React.Key | null) => {
    if (key === null) { return; }
    setSelectedWine((prevState) => {
      const selectedItem = wineryWines.find((option) => option.id === key);
      const result = selectedItem ?? prevState;
      if (result != null) {
        setWineYear(result.year);
        setWineColor(result.color);
        setResidualSugar(result.residualSugar ?? null);
        setAlcoholContent(result.alcoholContent ?? null);
        setAcidity(result.acidity ?? null);
        setGrapeSweetness(result.grapesSweetness ?? null);
      }
      return result;
    });
  }

  const isWineNew = () => { return wineryWines.find((wine) => wine.name == wineName && wine.year == wineYear) == null; }

  const createNewSample = async () => {
    const newSample: WineSample = {
      name: sampleName,
      rating: sampleRating ?? 0,
      wineId: selectedWine?.id ?? "",
      catalogueId: catalogue.id,
      // TODO
      champion: false
    }
    let newWine: Wine;
    if (isWineNew() && selectedWinery != null) {
      newWine = {
        id: "",
        name: wineName,
        color: wineColor,
        year: wineYear ?? 0,
        residualSugar: residualSugar ?? undefined,
        alcoholContent: alcoholContent ?? undefined,
        acidity: acidity ?? undefined,
        grapesSweetness: grapeSweetness ?? undefined,
        winaryId: selectedWinery.id
      }
      const res: CommunicationResult<WineSample> = await CatalogueRepository.createSample(newSample, newWine);
      if (isSuccess(res)) {
        setWineSamples([...wineSamples, res.data]);
      }
    } else {
      const res: CommunicationResult<WineSample> = await CatalogueRepository.createSample(newSample);
      if (isSuccess(res)) {
        setWineSamples([...wineSamples, res.data]);
      }
    }
  }

  const sendVoiceInput = async () => {
    if (transcript.length == 0) { return; }
    const resWine = await axiosCall("POST", "/ner", { sentence: transcript }, undefined, "application/json", "http://localhost:8000");
    if (isSuccess(resWine)) {
      const wine = (resWine.data as { entity: {
        winery: string,
        wine: string,
        year: string,
        color: string
        rating: string
      } }).entity
      console.log(wine.color)
      const foundWinery = participatedWineries.find(item => item.name == wine.winery) ?? null;
      if (wine.winery != null) { setSelectedWinery(foundWinery); }
      if (wine.wine != null) { setWineName(wine.wine); }
      if (wine.year != null && !isNaN(parseInt(wine.year))) { setWineYear(parseInt(wine.year)); }
      if (wine.rating != null && !isNaN(parseInt(wine.year))) { setSampleRating(parseInt(wine.rating)); }
      if (wine.color != null) { setWineColor(wine.color); }
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
      <Autocomplete 
        label={t("winery", { ns: TranslationNS.catalogues })}
        placeholder={t("wineryPlaceholderSelect", { ns: TranslationNS.catalogues })}
        inputValue={selectedWinery?.name ?? ""}
        onSelectionChange={onWinerySelectionChange}
        isRequired
        variant="faded"
        labelPlacement="outside"
        defaultItems={participatedWineries}
        startContent={<ClipboardDocumentIcon className="w-5 h-5 text-gray-600" /> }
      >
        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
      </Autocomplete>

      <Autocomplete 
        label={t("wine", { ns: TranslationNS.catalogues })}
        placeholder={t("winePlaceholder", { ns: TranslationNS.catalogues })}
        inputValue={wineName}
        onInputChange={setWineName}
        allowsCustomValue
        onSelectionChange={onWineSelectionChange}
        //isDisabled={selectedWinery == null}
        isRequired
        variant="faded"
        labelPlacement="outside"
        defaultItems={wineryWines}
        startContent={<ClipboardDocumentIcon className="w-5 h-5 text-gray-600" /> }
        description={
          wineName.length > 0 && !isWineNew() ? (
            <p className="text-green-400">Selected wine</p>
          ) : wineName.length > 0 ? (
            <p className="text-red-400">Creating new wine</p>
          ) : ( "" )
        }
      >
        {(item) => <AutocompleteItem key={item.id} textValue={item.name}>{getWineSearchName(item)}</AutocompleteItem>}
      </Autocomplete>

      <div className="flex flex-row gap-4">
        <CatalogueInputField
          value={sampleName}
          //isDisabled={selectedWinery == null}
          onValueChange={setSampleName}
          label={t("sampleName", { ns: TranslationNS.catalogues })}
          placeholder={t("sampleNamePlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />

        <CatalogueInputField 
          type="number"
          value={wineYear == null ? "" : wineYear.toString()} 
          //isDisabled={selectedWinery == null}
          onValueChange={(val) => setWineYear(val == "" ? null : parseInt(val))} 
          label={t("wineYear", { ns: TranslationNS.catalogues })}
          placeholder={t("wineYearPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />
      </div>
      <div className="flex flex-row gap-4">
        <Slider 
          label={t("rating", { ns: TranslationNS.catalogues })}
          value={sampleRating ?? 0}
          //isDisabled={selectedWinery == null}
          onChange={(value) => typeof value == "number" ? setSampleRating(value) : setSampleRating(value[0])} 
          step={1} 
          // TODO: change only to catalogue rating
          maxValue={catalogue.maxWineRating == 0 ? 100 : catalogue.maxWineRating} 
          minValue={0} 
          defaultValue={0}
          className="max-w-md"
          color="primary"
        />

        <RadioGroup
          label={t("wineColor", { ns: TranslationNS.catalogues })}
          isReadOnly={!isWineNew()}
          //isDisabled={selectedWinery == null}
          orientation="horizontal"
          value={wineColor}
          onValueChange={setWineColor}
        >
          <Radio value={WineColor.RED}>{t("redWineColor", { ns: TranslationNS.catalogues })}</Radio>
          <Radio value={WineColor.WHITE}>{t("whiteWineColor", { ns: TranslationNS.catalogues })}</Radio>
          <Radio value={WineColor.ROSE}>{t("roseWineColor", { ns: TranslationNS.catalogues })}</Radio>
        </RadioGroup>
      </div> 
      <h2 className="text-lg font-bold">
        {t("wineDetails", { ns: TranslationNS.catalogues })}
      </h2>
      <div className="flex flex-row gap-4">
        <CatalogueInputField 
          type="number"
          value={residualSugar == null ? "" : residualSugar.toString()} 
          isReadOnly={!isWineNew()}
          //isDisabled={selectedWinery == null}
          onValueChange={(val) => setResidualSugar(val == "" ? null : parseInt(val))}     
          label={t("residualSugar", { ns: TranslationNS.catalogues })}
          placeholder={t("residualSugarPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />

        <CatalogueInputField
          type="number"
          value={alcoholContent == null ? "" : alcoholContent.toString()} 
          isReadOnly={!isWineNew()}
          //isDisabled={selectedWinery == null}
          onValueChange={(val) => setAlcoholContent(val == "" ? null : parseInt(val))} 
          label={t("alcoholContent", { ns: TranslationNS.catalogues })}
          placeholder={t("alcoholContentPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />

        <CatalogueInputField
          type="number"
          value={acidity == null ? "" : acidity.toString()} 
          isReadOnly={!isWineNew()}
          //isDisabled={selectedWinery == null}
          onValueChange={(val) => setAcidity(val == "" ? null : parseInt(val))} 
          label={t("acidity", { ns: TranslationNS.catalogues })}
          placeholder={t("acidityPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />

        <CatalogueInputField
          type="number"
          value={grapeSweetness == null ? "" : grapeSweetness.toString()} 
          isReadOnly={!isWineNew()}
          //isDisabled={selectedWinery == null}
          onValueChange={(val) => setGrapeSweetness(val == "" ? null : parseInt(val))} 
          label={t("grapeSweetness", { ns: TranslationNS.catalogues })}
          placeholder={t("grapeSweetnessPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />
      </div>

      <VoiceInputButton 
        startListening={startListening}
        stopListening={stopListening}
        listening={listening}
      />

      {/* TODO CALL EDIT */}
      <PrimaryButton 
        className="ml-auto" 
        onClick={createNewSample}
      >
        {isWineNew() 
          ? t("createAndAddWine", { ns: TranslationNS.catalogues })
          : t("addWineSample", { ns: TranslationNS.catalogues })
        }
      </PrimaryButton> 

      <Divider />

      <WineTable wineSamples={wineSamples} uiState={{ type: UiStateType.SUCCESS }} />
    </div>
  )
}

export default CreatePageContent3