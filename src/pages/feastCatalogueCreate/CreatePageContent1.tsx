import { Textarea } from "@heroui/react";
import CatalogueInputField from "./components/CatalogueInputField"
import { useEffect, useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { ClipboardDocumentIcon, MapPinIcon, PencilSquareIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Catalogue } from "../../model/Catalogue";
import ImageUploader from "../../components/ImageUploader";
import ImageSlider from "../../components/ImageSlider";
import { useTranslation } from "react-i18next";
import { TranslationNS } from "../../translations/i18n";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { convertUnixToDate } from "../../utils/conversionUtils";
import DatePickerGeneric from "../../components/Controls/DatePickerGeneric";

export type CatalogueData = {
  title: string;
  year: number | null;
  description: string;
  date: Date | null;
  address: string;
}

type Props = { 
  isEditing: boolean;
  catalogue: Catalogue | null;
  setCatalogue: (catalogue: Catalogue) => void;
  sendCatalogueData: (catalogueData: CatalogueData, edit: boolean) => Promise<Catalogue | null>;
  isCatalogueCreated: () => boolean
}

const CreatePageContent1 = ({ isEditing, catalogue = null, setCatalogue, sendCatalogueData, isCatalogueCreated }: Props) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState<string>("");
  const [year, setYear] = useState<number | null>(null);
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [address, setAddress] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [imagesToUpload, setImagesToUpload] = useState<File[] | null>(null);

  useEffect(() => {
    if (isEditing && catalogue != null) {
      setTitle(catalogue.title);
      setYear(catalogue.year);
      setDescription(catalogue.description ?? "");
      setDate(convertUnixToDate(catalogue.startDate));
      setAddress(catalogue.address);
    }
  }, [catalogue, isEditing]);

  const uploadImages = async (files: File[] | null, catalogueId: string) => {
    if (files == null || files.length == 0) { return; }

    const res: CommunicationResult<string[]> = await CatalogueRepository.uploadImages(catalogueId, files);
    if (isSuccess(res) && catalogue != null) {
      const newImages = [...(catalogue.imageUrl ?? []), ...res.data];
      setCatalogue({ ...catalogue, imageUrl: newImages });
    }
  };

  const deleteImage = async (imageUrl: string) => {
    if (catalogue == null) {
      const imageIndex = images.findIndex(img => img == imageUrl);
      setImagesToUpload(val => val?.filter((_, index) => index != imageIndex) ?? null);
      setImages(val => val.filter(img => img != imageUrl));
      return; 
    }

    const res: CommunicationResult<SuccessMessage> = await CatalogueRepository.deleteImage(catalogue.id, imageUrl);
    if (isSuccess(res)) {
      const images = catalogue.imageUrl?.filter(img => img != imageUrl);
      setCatalogue({ ...catalogue, imageUrl: images });
    }
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-row gap-4">
          <CatalogueInputField
            value={title}
            onValueChange={setTitle}
            isRequired 
            label={t("catalogueTitle", { ns: TranslationNS.catalogues })}
            placeholder={t("catalogueTitlePlaceholder", { ns: TranslationNS.catalogues })}
            StartContent={ClipboardDocumentIcon}
          />
          <CatalogueInputField
            value={year == null ? "" : year.toString()}
            onValueChange={(val) => setYear(val == "" ? null : parseInt(val))}
            isRequired 
            label={t("feastYear", { ns: TranslationNS.catalogues })}
            placeholder={t("feastYearPlaceholder", { ns: TranslationNS.catalogues })}
            type="number"
            StartContent={SparklesIcon}
          />
        </div>

        <Textarea 
          value={description} 
          onValueChange={setDescription} 
          variant="faded" 
          label={t("catalogueDescription", { ns: TranslationNS.catalogues })}
          placeholder={t("catalogueDescriptionPlaceholder", { ns: TranslationNS.catalogues })}
          startContent={<PencilSquareIcon className="w-5 h-5 text-gray-600"/>}
          classNames={{
            inputWrapper: [
              "data-[hover=true]:border-tertiary",
              "data-[focus=true]:border-secondary",
            ]
          }}
        />

        <div className="flex flex-row gap-4">
          <DatePickerGeneric 
            value={date} 
            onChange={setDate} 
            label={t("dateAndTime", { ns: TranslationNS.catalogues })}
          />

          <CatalogueInputField 
            value={address} 
            onValueChange={setAddress} 
            label={t("placeAndAddress", { ns: TranslationNS.catalogues })}
            placeholder={t("placeAndAddressPlaceholder", { ns: TranslationNS.catalogues })}
            StartContent={MapPinIcon}
          />
        </div>

        <PrimaryButton 
          className="w-32 ml-auto" 
          onClick={() => isEditing || isCatalogueCreated() 
            ? sendCatalogueData({ title, year, description, date, address }, true)
            : (async () => {
                const catalogueResponse = await sendCatalogueData({ title, year, description, date, address }, false);
                if (catalogueResponse == null) { return; }
                uploadImages(imagesToUpload, catalogueResponse.id);
              })()
          }
        >
          {isEditing || isCatalogueCreated() 
          ? t("edit", { ns: TranslationNS.catalogues })
          : t("create", { ns: TranslationNS.catalogues })
          }
        </PrimaryButton>

      </div>
      <div className="flex flex-col gap-6 basis-[25%]">
        <div className="h-[30rem]">
          <ImageSlider 
            imageUrls={catalogue == null ? images : catalogue.imageUrl ?? []} 
            onDelete={deleteImage}
            />
        </div>
        
        <ImageUploader 
          
          onSelect={data => {
            if (catalogue == null || !isEditing) { 
              setImages(data.previewUrls);
              setImagesToUpload(data.files);
            } else {
              uploadImages(data.files, catalogue.id);
            }
          }}
        />
      </div>
    </div>
  )
}

export default CreatePageContent1