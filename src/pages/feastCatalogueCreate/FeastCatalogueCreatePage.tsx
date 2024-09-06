import { useEffect, useState } from "react"
import PrimaryButton from "../../components/PrimaryButton";
import { Catalogue } from "../../model/Catalogue";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { axiosCall } from "../../communication/axios";
import { useAuth } from "../../context/AuthProvider";
import CreatePageContent2 from "./CreatePageContent2";
import CreatePageContent3 from "./CreatePageContent3";
import CreatePageContent1, { CatalogueData } from "./CreatePageContent1";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { notifySuccess } from "../../utils/toastNotify";

const FeastCatalogueCreatePage = () => {
  const [page, setPage] = useState<number>(1);
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { id } = useParams();
  const { accessToken, getUserData } = useAuth();

  useEffect(() => {
    const fetchCatalogue = async () => {
      if (id == null) { return; } 

      setIsEditing(true);
      const res: CommunicationResult<Catalogue> = await axiosCall(`/catalogues/${id}`, "GET", undefined, accessToken ?? undefined);
      if (isSuccess(res)) {
        setCatalogue(res.data);
      }
    }
    
    fetchCatalogue();
  }, [accessToken, id]);

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

  const sendCatalogueData = async (catalogueData: CatalogueData, edit: boolean = false) => {
    if (catalogueData.title == "" || catalogueData.year == null || catalogueData.date == null) {
      console.log(`Please fill in all required fields.`);
      return;
    }

    const catalogue: Catalogue = prepareCatalogueData(catalogueData);

    const res: CommunicationResult<Catalogue> = await axiosCall(
      edit ? `/catalogues/${catalogue.id}` : "/catalogues", 
      edit ? "PUT" : "POST", 
      { ...catalogue }, 
      accessToken ?? undefined
    );
    if (isSuccess(res)) {
      if (!edit) {
        setCatalogue(res.data);
      }
      notifySuccess(edit ? "Catalogue Edited" : "Catalogue created");
    } else {
      console.log(`Error: ${res.message}`);
    }
  }

  const isCatalogueCreated = () => { return catalogue != null; }


  return (
    <>
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold flex-1">Create Feast Catalogue</h1>
        {page}
        <PrimaryButton onClick={() => setPage(p => p - 1)} isDisabled={ page == 1 }>&lt;</PrimaryButton>
        <PrimaryButton onClick={() => setPage(p => p + 1)} isDisabled={ page == 3 || catalogue == null }>&gt;</PrimaryButton>
      </div>
      {page == 1 && (
        <CreatePageContent1 isEditing={isEditing} catalogue={catalogue} sendCatalogueData={sendCatalogueData} isCatalogueCreated={isCatalogueCreated} />
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