import { useEffect, useState } from "react"
import PrimaryButton from "../../components/PrimaryButton";
import { Catalogue } from "../../model/Catalogue";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import CreatePageContent2 from "./CreatePageContent2";
import CreatePageContent3 from "./CreatePageContent3";
import CreatePageContent1, { CatalogueData } from "./CreatePageContent1";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { notifySuccess } from "../../utils/toastNotify";
import StepIndicator from "../../components/StepIndicator";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { useAuth } from "../../context/AuthProvider";

const FeastCatalogueCreatePage = () => {
  const [page, setPage] = useState<number>(1);
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { getUserData } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const fetchCatalogue = async () => {
      if (id == null) { return; } 

      setIsEditing(true);
      const res: CommunicationResult<Catalogue> = await CatalogueRepository.getCatalogueDetail(id);
      if (isSuccess(res)) {
        setCatalogue(res.data);
      }
    }
    
    fetchCatalogue();
  }, [id]);

  const prepareCatalogueData = (catalogueData: CatalogueData): Catalogue => {
    return {
      id: catalogue?.id ?? "",
      title: catalogueData.title,
      description: catalogueData.description,
      year: catalogueData.year ?? 0,
      startDate: Math.floor(new Date(catalogueData.date?.toString() ?? "").getTime() / 1000),
      address: catalogueData.address,
      location: {
        latitude: catalogue?.location?.latitude ?? 0,
        longitude: catalogue?.location?.longitude ?? 0
      },
      imageUrl: catalogue?.imageUrl ?? [],
      published: catalogue?.published ?? false,
      locked: catalogue?.locked ?? false,
      maxWineRating: catalogue?.maxWineRating ?? 0,
      adminId: getUserData()?.id ?? "",
      price: catalogue?.price ?? 0,
      downloads: catalogue?.downloads ?? 0,
      participatedWineries: catalogue?.participatedWineries ?? []
    }
  }

  const sendCatalogueData = async (catalogueData: CatalogueData, edit: boolean = false): Promise<Catalogue | null> => {
    if (catalogueData.title == "" || catalogueData.year == null || catalogueData.date == null) {
      console.log(`Please fill in all required fields.`);
      return null;
    }

    const catalogue: Catalogue = prepareCatalogueData(catalogueData);

    const res: CommunicationResult<Catalogue> = 
      edit ? await CatalogueRepository.editCatalogue(catalogue)
           : await CatalogueRepository.createCatalogue(catalogue);
    if (isSuccess(res)) {
      if (!edit) {
        setCatalogue(res.data);
      }
      notifySuccess(edit ? "Catalogue Edited" : "Catalogue created");
      return res.data;
    } else {
      console.log(`Error: ${res.message}`);
      return null;
    }
  }

  const isCatalogueCreated = () => { return catalogue != null; }


  return (
    <>
      <div className="flex flex-row mb-8 items-center">
        <h1 className="text-2xl font-bold flex-1">Create Feast Catalogue</h1>
        <StepIndicator currentStep={page} />
        <PrimaryButton onClick={() => setPage(p => p - 1)} isDisabled={ page == 1 }>&lt;</PrimaryButton>
        <PrimaryButton onClick={() => setPage(p => p + 1)} isDisabled={ page == 3 || catalogue == null }>&gt;</PrimaryButton>
      </div>
      {page == 1 && (
        <CreatePageContent1 
          isEditing={isEditing} 
          catalogue={catalogue}
          setCatalogue={setCatalogue}
          sendCatalogueData={sendCatalogueData} 
          isCatalogueCreated={isCatalogueCreated} 
        />
      )}
      {page == 2 && catalogue != null && (
        <CreatePageContent2 catalogue={catalogue} />
      )}
      
      {page == 3 && catalogue != null && (
        <CreatePageContent3 catalogue={catalogue} />
      )}
      <ToastContainer />
    </>
  )
}

export default FeastCatalogueCreatePage