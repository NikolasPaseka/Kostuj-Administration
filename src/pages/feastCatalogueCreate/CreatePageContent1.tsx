import { DatePicker, DateValue, Textarea } from "@nextui-org/react";
import CatalogueInputField from "./components/CatalogueInputField"
import { useEffect, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { CalendarDaysIcon, ChevronDownIcon, ClipboardDocumentIcon, MapPinIcon, PencilSquareIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Catalogue } from "../../model/Catalogue";
import { getLocalTimeZone, today } from "@internationalized/date";
import ImageUploader from "../../components/ImageUploader";
import ImageSlider from "../../components/ImageSlider";

export type CatalogueData = {
  title: string;
  year: number | null;
  description: string;
  date: DateValue | null;
  address: string;
}

type Props = { 
  isEditing: boolean;
  catalogue: Catalogue | null;
  sendCatalogueData: (catalogueData: CatalogueData, edit: boolean) => void;
  isCatalogueCreated: () => boolean
}

const CreatePageContent1 = ({ isEditing, catalogue = null, sendCatalogueData, isCatalogueCreated }: Props) => {

  const [title, setTitle] = useState<string>("");
  const [year, setYear] = useState<number | null>(null);
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<DateValue | null>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (isEditing && catalogue != null) {
      setTitle(catalogue.title);
      setYear(catalogue.year);
      setDescription(catalogue.description ?? "");
      //TODO
      setDate(today(getLocalTimeZone()));
      setAddress(catalogue.address);
    }
  }, [catalogue, isEditing]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <CatalogueInputField
          value={title}
          onValueChange={setTitle}
          isRequired 
          label="Catalogue Title" 
          placeholder="Enter catalogue title" 
          StartContent={ClipboardDocumentIcon}
        />
        <CatalogueInputField
          value={year == null ? "" : year.toString()}
          onValueChange={(val) => setYear(val == "" ? null : parseInt(val))}
          isRequired 
          label="Feast Year" 
          placeholder="Enter feast year" 
          type="number"
          StartContent={SparklesIcon}
        />
      </div>

      <Textarea 
        value={description} 
        onValueChange={setDescription} 
        variant="faded" 
        label="Catalogue Description" 
        placeholder="Catalogue Content" 
        labelPlacement="outside"
        startContent={<PencilSquareIcon className="w-5 h-5 text-gray-600"/>}
      />

      <div className="flex flex-row gap-4">
        <DatePicker 
          value={date} 
          onChange={setDate} 
          variant="faded" 
          isRequired 
          label="Date and Time" 
          labelPlacement="outside"
          startContent={<CalendarDaysIcon className="w-5 h-5 text-gray-600" />}
          selectorIcon={<ChevronDownIcon />}
        />
        <CatalogueInputField 
          value={address} 
          onValueChange={setAddress} 
          label="Address" 
          placeholder="Input Address"
          StartContent={MapPinIcon}
        />
      </div>

      <PrimaryButton 
        className="w-32 ml-auto" 
        onClick={() => isEditing || isCatalogueCreated() 
          ? sendCatalogueData({ title, year, description, date, address }, true)
          : sendCatalogueData({ title, year, description, date, address }, false)
        }
      >
        {isEditing || isCatalogueCreated() ? "Edit" : "Create"}
      </PrimaryButton>

      <ImageUploader />
      <ImageSlider imageUrls={["https://picsum.photos/200/300", "https://www.bradleysofflicence.ie/wp-content/uploads/2023/10/IMG-0482__69566-scaled.jpg"]} />
    </div>
  )
}

export default CreatePageContent1