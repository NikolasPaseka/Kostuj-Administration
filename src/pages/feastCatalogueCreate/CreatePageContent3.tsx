import { useEffect, useRef, useState } from "react"
import PrimaryButton from "../../components/PrimaryButton"
import CatalogueInputField from "./components/CatalogueInputField"
import { ClipboardDocumentIcon, MicrophoneIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Accordion, AccordionItem, Autocomplete, AutocompleteItem, Checkbox, Divider, Kbd, Radio, RadioGroup, Slider, useDisclosure } from "@nextui-org/react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { Winery } from "../../model/Winery";
import { Catalogue } from "../../model/Catalogue";
import { resolveUiState, UiState, UiStateType } from "../../communication/UiState";
import { WineSample } from "../../model/WineSample";
import { Wine } from "../../model/Wine";
import WineTable from "../../components/Tables/WineTable/WineTable";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "../../translations/i18n";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { WineryRepository } from "../../communication/repositories/WineryRepository";
import { WineColor } from "../../model/Domain/WineColor";
import useVoiceControl from "../../hooks/useVoiceControl";
import VoiceInputButton from "../../components/VoiceInputButton";
import Fuse from 'fuse.js'
import { VoiceControlRepository } from "../../communication/repositories/VoiceControlRepository";
import SelectionField from "../../components/Controls/SelectionField";
import { ResultSweetnessOptions } from "../../model/Domain/ResultSweetness";
import CreateWineryModal from "../../components/Modals/CreateWineryModal";
import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";

const resultSweetnessOptions = [
  {name: "Suché", uid: ResultSweetnessOptions.DRY},
  {name: "Polosuché", uid: ResultSweetnessOptions.OFF_DRY},
  {name: "Polosladké", uid: ResultSweetnessOptions.SEMI_SWEET},
  {name: "Sladké", uid: ResultSweetnessOptions.SWEET}
];

type Props = { catalogue: Catalogue }

const CreatePageContent3 = ({ catalogue }: Props) => {
  const { t } = useTranslation();
  const [uiStateWineSample, setUiStateWineSample] = useState<UiState> ({ type: UiStateType.LOADING });
  const {isOpen: isNewWineryOpen, onOpen: onNewWineryOpen, onOpenChange: onNewWineryOpenChange} = useDisclosure();

  const [participatedWineries, setParticipatedWineries] = useState<Winery[]>([]);
  const [selectedWinery, setSelectedWinery] = useState<Winery | null>(null);
  const [wineryWines, setWineryWines] = useState<Wine[]>([]);

  const [wineSamples, setWineSamples] = useState<WineSample[]>([]);

  const [wineryName, setWineryName] = useState<string>("");
  const [wineName, setWineName] = useState<string>("");
  const [sampleName, setSampleName] = useState<string>("");
  const [wineYear, setWineYear] = useState<number | null>(null);
  const [sampleRating, setSampleRating] = useState<number | null>(null);
  const [wineColor, setWineColor] = useState<string>("");
  const [isChampion, setIsChampion] = useState<boolean>(false);
  const [ratingCommission, setRatingCommission] = useState<number | null>(null);
  const [sampleNote, setSampleNote] = useState<string>("");
  const [resultSweetness, setResultSweetness] = useState<string>("");
  const [attribute, setAttribute] = useState<string>("");

  // Wine Details
  const [residualSugar, setResidualSugar] = useState<number | null>(null);
  const [alcoholContent, setAlcoholContent] = useState<number | null>(null);
  const [acidity, setAcidity] = useState<number | null>(null);
  const [grapeSweetness, setGrapeSweetness] = useState<number | null>(null);

  // Input references
  const wineryInputRef = useRef<HTMLInputElement>(null);
  const wineInputRef = useRef<HTMLInputElement>(null);
  const wineYearInputRef = useRef<HTMLInputElement>(null);

  // Voice shortcut
  // handle what happens on key press
  // const handleKeyPress = useCallback((event: ) => {
  //   if (event.shiftKey === true) {
  //     console.log(`Key pressed: ${event.key}`);
  //   }
  // }, []);

  useEffect(() => {
    const fetchParticipatedWineries = async () => { 
      const res: CommunicationResult<Winery[]> = await CatalogueRepository.getParticipatedWineries(catalogue);
      if (isSuccess(res)) {
        setParticipatedWineries(res.data);
      }
    }

    const fetchAddedWineSamples = async () => {
      const res: CommunicationResult<WineSample[]> = await CatalogueRepository.getSamples(catalogue.id);
      setWineSamples(resolveUiState(res, setUiStateWineSample) ?? []);
    } 
    
    fetchParticipatedWineries();
    fetchAddedWineSamples();

    // // attach the event listener
    // document.addEventListener('keydown', handleKeyPress);
    // // remove the event listener
    // return () => {
    //   document.removeEventListener('keydown', handleKeyPress);
    // };
  }, [catalogue]);

  const fetchWineryWines = async (winery: Winery) => {
    const res: CommunicationResult<Wine[]> = await WineryRepository.getWineryWines(winery.id);
    if (isSuccess(res)) {
      setWineryWines(res.data);
    }
  }

  const setWineryNameWithMatch = (value: string) => {
    setWineryName(value ?? "");
    const foundWinery = participatedWineries.find((winery) => winery.name === value) ?? null;
    setSelectedWinery(foundWinery);
    if (foundWinery != null) {
      fetchWineryWines(foundWinery);
    }
  }

  const onWinerySelected = (winery: Winery | null) => {
    setSelectedWinery(winery);
    if (winery == null) {
      setWineryWines([]);
      return; 
    }
    fetchWineryWines(winery);
  }

  const onWinerySelectionChange = (key: React.Key | null) => {
    if (key === null) { return; }
    setSelectedWinery((prevState) => {
      const selectedItem = participatedWineries.find((option) => option.id === key);
      const result = selectedItem ?? prevState;
      if (result != null) {
        setWineryName(result.name);
        fetchWineryWines(result);
      }
      return result;
    });
  }

  const createNewWinery = (winery: Winery) => {
    setSelectedWinery(winery);
    addParticipatedWinery(winery);
  }

  const addParticipatedWinery = async (winery: Winery) => {
    const res: CommunicationResult<Winery> = await CatalogueRepository.addParticipatedWinery(catalogue, winery);
    if (isSuccess(res)) { 
      setParticipatedWineries([...participatedWineries, res.data]);
    }
  }

  const foundWine: Wine | null = wineryWines.find((wine) => wine.name == wineName && wine.year == wineYear) ?? null;
  const isWineNew = (): boolean => { return foundWine == null; }

  const createNewSample = async () => {
    if (selectedWinery == null) { return; }

    const newSample: WineSample = {
      name: sampleName,
      rating: sampleRating ?? 0,
      wineId: "",
      catalogueId: catalogue.id,
      champion: isChampion,
      note: sampleNote,
      ratingCommission: ratingCommission ?? undefined
    }
    const wine: Wine = {
      id: "",
      name: wineName,
      color: wineColor,
      year: wineYear ?? 0,
      attribute: attribute,
      residualSugar: residualSugar ?? undefined,
      resultSweetness: resultSweetness.isEmpty() ? undefined : resultSweetness,
      alcoholContent: alcoholContent ?? undefined,
      acidity: acidity ?? undefined,
      grapesSweetness: grapeSweetness ?? undefined,
      winaryId: selectedWinery.id,
      grapeVarietals: [{ grape: wineName }]
    }

    const res: CommunicationResult<WineSample> = await CatalogueRepository.createSample(newSample, wine, selectedWinery.id);
    if (isSuccess(res)) {
      clearInputData();
      setWineSamples([...wineSamples, res.data]);
    }
  }

  const deleteWineSample = async (sample: WineSample) => {
    const res: CommunicationResult<SuccessMessage> = await CatalogueRepository.deleteSample(sample); 
    if (isSuccess(res)) {
      setWineSamples([...wineSamples.filter(s => s.id !== sample.id)]);
    }
  }

  const areRequiredFieldsFilled = (): boolean => {
    return selectedWinery != null && wineName.length > 0 && wineYear != null && wineColor.length > 0;
  }

  const clearInputData = () => {
    setWineryName("");
    //setWineName("");
    setSampleName("");
    setWineYear(null);
    setSampleRating(null);
    //setWineColor("");
    setResidualSugar(null);
    setAlcoholContent(null);
    setAcidity(null);
    setGrapeSweetness(null);
    setIsChampion(false);
    setSampleNote("");
    setRatingCommission(null);
    setAttribute("");
    setResultSweetness("");
  }

  const sendVoiceInput = async () => {
    if (transcript.length == 0) { return; }
    const resWine = await VoiceControlRepository.sendWineRequest(transcript);
    if (isSuccess(resWine)) {
      const wine = (resWine.data as { entity: {
        winery: string | null,
        wine: string | null,
        year: string | null,
        color: string | null,
        rating: string | null
        resultSweetness: string | null
      } }).entity

      console.log(wine);
      const notNullValuesCount = Object.values(wine).filter(value => value !== null).length;
      console.log(`Number of null values: ${notNullValuesCount}`);

      let matchedWinery: Winery | null = null;
      if (wine.winery != null) {
        const fuse = new Fuse(participatedWineries, {
          keys: ['name'],
          threshold: 0.3
        })
        const results: Winery[] = fuse.search(wine.winery).map((item) => item.item);
        console.log(results)
        if (results.length > 0) {
           matchedWinery = participatedWineries.find(item => item.id == results[0].id) ?? null; 
        }
      }

      if (matchedWinery) { 
        onWinerySelected(matchedWinery)
        setWineryName(matchedWinery.name);
        if (notNullValuesCount == 1) { wineryInputRef.current?.focus()}
      } else if (selectedWinery == null) {
        onWinerySelected(null);
        if (wine.winery != null) { setWineryName(wine.winery); }
      }

      if (wine.wine != null) { 
        // capitalize every first letter of the word
        const words = wine.wine.split(" ");
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        setWineName(words.join(" "));
        if (notNullValuesCount == 1) { wineInputRef.current?.focus(); } 
      }
      if (wine.year != null && !isNaN(parseInt(wine.year))) { setWineYear(parseInt(wine.year)); if (notNullValuesCount == 1) { wineYearInputRef.current?.focus()} }
      if (wine.rating != null && !isNaN(parseInt(wine.rating))) { setSampleRating(parseInt(wine.rating)); }
      if (wine.color != null) { setWineColor(wine.color); }
      if (wine.resultSweetness != null) { setResultSweetness(wine.resultSweetness); }
    }
  }

  const {
    transcript,
    startListening,
    stopListening,
    listening
  } = useVoiceControl(sendVoiceInput);


  return (
    <div className="flex flex-col gap-4">
        <Accordion
          variant="bordered"
          className=""
        >
          <AccordionItem 
            aria-label="Accordion" 
            title="Show voice control"
            startContent={<MicrophoneIcon className='w-5 h-5 text-secondary' />
          }>
            <div className="flex flex-row gap-4 items-center ">
              <VoiceInputButton 
                startListening={startListening}
                stopListening={stopListening}
                listening={listening}
                placeAsFixed={false}
              />
              <Kbd keys={["option"]} className="h-8">M</Kbd>
              <div className="flex-1">
                <p>Microphone: {listening ? "on" : "off"}</p>
                <p className="italic text-sm text-gray-600">Transcript: {transcript.isEmpty() ? "-" : transcript}</p>
                {/* <Progress value={remainingTime} className="" size="sm" color="secondary"/> */}
              </div>
            </div>
          </AccordionItem>
      </Accordion>

      <Autocomplete
        ref={wineryInputRef}
        allowsCustomValue
        label={t("winery", { ns: TranslationNS.catalogues })}
        placeholder={t("wineryPlaceholderSelect", { ns: TranslationNS.catalogues })}
        inputValue={wineryName}
        onValueChange={setWineryNameWithMatch}
        onSelectionChange={onWinerySelectionChange}
        isInvalid={selectedWinery == null && wineryName.length > 0}
        errorMessage={
          <p 
            onClick={() => { onNewWineryOpen(); }}
            className="text-danger cursor-pointer"
          >This winery is not in the list! Click to create</p>
        }
        isRequired
        variant="faded"
        defaultItems={participatedWineries}
        startContent={<ClipboardDocumentIcon className="w-5 h-5 text-gray-600" /> }
        inputProps={{
          classNames: {
            inputWrapper: [`${ selectedWinery == null && wineryName.length > 0 
              ? "border-danger data-[hover=true]:border-danger" 
              : "data-[hover=true]:border-tertiary data-[focus=true]:border-tertiary data-[open=true]:border-secondary" }`]
          }
        }}
      >
        {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
      </Autocomplete>

      <CreateWineryModal
        wineryName={wineryName}
        isOpen={isNewWineryOpen}
        onOpenChange={onNewWineryOpenChange}
        onWineryCreateOrEdit={createNewWinery}
      />

      <div className="flex flex-row gap-4">

        <CatalogueInputField
          ref={wineInputRef}
          label={t("wine", { ns: TranslationNS.catalogues })}
          placeholder={t("winePlaceholder", { ns: TranslationNS.catalogues })}
          value={wineName}
          onValueChange={setWineName}
          isRequired
          StartContent={ClipboardDocumentIcon}
          className="flex-1"
          description={
            wineName.length > 0 && !isWineNew() ? (
              <p className="text-green-400">Selected wine</p>
            ) : wineName.length > 0 ? (
              <p className="text-red-400">Creating new wine</p>
            ) : ( "" )
          }
        >
        </CatalogueInputField>

        <div className="flex-1">
        <RadioGroup
          isRequired
          label={t("wineColor", { ns: TranslationNS.catalogues })}
          orientation="horizontal"
          value={wineColor}
          onValueChange={setWineColor}
          color="secondary"
          className="w-[100%]"
        >
          <Radio value={WineColor.RED}>{t("redWineColor", { ns: TranslationNS.catalogues })}</Radio>
          <Radio value={WineColor.WHITE}>{t("whiteWineColor", { ns: TranslationNS.catalogues })}</Radio>
          <Radio value={WineColor.ROSE}>{t("roseWineColor", { ns: TranslationNS.catalogues })}</Radio>
        </RadioGroup>
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <CatalogueInputField
          value={sampleName}
          onValueChange={setSampleName}
          label={t("sampleName", { ns: TranslationNS.catalogues })}
          placeholder={t("sampleNamePlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />

        <CatalogueInputField
          ref={wineYearInputRef}
          isRequired
          type="number"
          value={wineYear == null ? "" : wineYear.toString()} 
          onValueChange={(val) => setWineYear(val == "" ? null : parseInt(val))} 
          label={t("wineYear", { ns: TranslationNS.catalogues })}
          placeholder={t("wineYearPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex-1">
          <Slider 
            label={t("rating", { ns: TranslationNS.catalogues })}
            value={sampleRating ?? 0}
            onChange={(value) => typeof value == "number" ? setSampleRating(value) : setSampleRating(value[0])} 
            step={1} 
            // TODO: change only to catalogue rating
            maxValue={catalogue.maxWineRating == 0 ? 100 : catalogue.maxWineRating} 
            minValue={0} 
            defaultValue={0}
            color="secondary"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-4">
          <CatalogueInputField
            // TODO add ref for voice control
            type="number"
            value={ratingCommission == null ? "" : ratingCommission.toString()} 
            onValueChange={(val) => setRatingCommission(val == "" ? null : parseInt(val))} 
            label={"Hodnotící komise"}
            placeholder={"Zadejte hodnotící komisi"}
            StartContent={PencilSquareIcon}
            className="flex-1"
          />
          <Checkbox
            color="secondary"
            isSelected={isChampion}
            onValueChange={setIsChampion}
          >
            Champion wine 👑
          </Checkbox>
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <SelectionField
          label={"Sladkost"}
          variant="faded"
          items={resultSweetnessOptions.map((option) => ({ value: option.uid, label: option.name }))}
          defaultSelectedKeys={[resultSweetness]}
          selectedKeys={[resultSweetness]}
          onSelectionChange={(e) => setResultSweetness(e.target.value)}
          key={1}
        />

        <CatalogueInputField
          value={attribute} 
          onValueChange={setAttribute} 
          label={"Přívlastek"}
          placeholder={"Zadejte přívlastek"}
          StartContent={PencilSquareIcon}
        />
      </div>

      <CatalogueInputField
          value={sampleNote} 
          onValueChange={setSampleNote} 
          label={"Poznámka"}
          placeholder={"Zadejte poznámku"}
          StartContent={PencilSquareIcon}
      />

      <h2 className="text-lg font-bold">
        {t("wineDetails", { ns: TranslationNS.catalogues })}
      </h2>
      <div className="flex flex-row gap-4">
        <CatalogueInputField 
          type="number"
          value={residualSugar == null ? "" : residualSugar.toString()} 
          onValueChange={(val) => setResidualSugar(val == "" ? null : parseInt(val))}     
          label={t("residualSugar", { ns: TranslationNS.catalogues })}
          placeholder={t("residualSugarPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />

        <CatalogueInputField
          type="number"
          value={alcoholContent == null ? "" : alcoholContent.toString()} 
          onValueChange={(val) => setAlcoholContent(val == "" ? null : parseInt(val))} 
          label={t("alcoholContent", { ns: TranslationNS.catalogues })}
          placeholder={t("alcoholContentPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />

        <CatalogueInputField
          type="number"
          value={acidity == null ? "" : acidity.toString()} 
          onValueChange={(val) => setAcidity(val == "" ? null : parseInt(val))} 
          label={t("acidity", { ns: TranslationNS.catalogues })}
          placeholder={t("acidityPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />

        <CatalogueInputField
          type="number"
          value={grapeSweetness == null ? "" : grapeSweetness.toString()} 
          onValueChange={(val) => setGrapeSweetness(val == "" ? null : parseInt(val))} 
          label={t("grapeSweetness", { ns: TranslationNS.catalogues })}
          placeholder={t("grapeSweetnessPlaceholder", { ns: TranslationNS.catalogues })}
          StartContent={PencilSquareIcon}
        />
      </div>

      {/* TODO CALL EDIT */}
      <PrimaryButton 
        className="ml-auto" 
        onClick={createNewSample}
        isDisabled={!areRequiredFieldsFilled()}
      >
        {isWineNew() 
          ? t("createAndAddWine", { ns: TranslationNS.catalogues })
          : t("addWineSample", { ns: TranslationNS.catalogues })
        }
      </PrimaryButton> 

      <Divider />

      <WineTable 
        wineSamples={wineSamples} 
        uiState={uiStateWineSample}
        showTableControls={false}
        deleteWineSample={deleteWineSample}
      />
    </div>
  )
}

export default CreatePageContent3
