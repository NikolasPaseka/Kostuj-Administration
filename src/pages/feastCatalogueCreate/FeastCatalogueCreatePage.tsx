import { DateValue } from "@nextui-org/react"
import { useState } from "react"
import PrimaryButton from "../../components/PrimaryButton";
import { Catalogue } from "../../model/Catalogue";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { axiosCall } from "../../communication/axios";
import { useAuth } from "../../context/AuthProvider";
import CreatePageContent2 from "./CreatePageContent2";
import CreatePageContent3 from "./CreatePageContent3";
import CreatePageContent1 from "./CreatePageContent1";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeastCatalogueCreatePage = () => {
  const [page, setPage] = useState<number>(1);
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);

  const { accessToken, getUserData } = useAuth();

  const notify = () => toast.success('Catalogue created', {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });

  const createCatalogue = async (title: string, year: number | null, description: string, date: DateValue | null, address: string) => {
    if (title == "" || year == null || date == null) {
      console.log(`Please fill in all required fields. ${title} ${year} ${date}`);
      return;
    }

    const catalogue: Catalogue = {
      id: "",
      title: title,
      description: description,
      year: year,
      startDate: Math.floor(new Date(date.toString()).getTime() / 1000),
      address: address,
      location: {
        latitude: 0,
        longitude: 0
      },
      imageUrl: [],
      published: false,
      locked: false,
      maxWineRating: 0,
      adminId: getUserData()?.id ?? "",
      price: 0,
      downloads: 0
    }

    const res: CommunicationResult<Catalogue> = await axiosCall("/catalogues", "POST", { ...catalogue }, accessToken ?? undefined);
    if (isSuccess(res)) {
      setCatalogue(res.data);
      notify();
      console.log(`Catalogue created: ${res.data.id}`);
    } else {
      console.log(`Error: ${res.message}`);
    }
  }

  const isCatalogueCreated = () => {
    return catalogue != null;
  }

  return (
    <>
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold flex-1">Create Feast Catalogue</h1>
        {page}
        <PrimaryButton onClick={() => setPage(p => p - 1)} isDisabled={ page == 1 }>&lt;</PrimaryButton>
        <PrimaryButton onClick={() => setPage(p => p + 1)} isDisabled={ page == 3 || catalogue == null }>&gt;</PrimaryButton>
      </div>
      {page == 1 && (
        <CreatePageContent1 createCatalogue={createCatalogue} isCatalogueCreated={isCatalogueCreated} />
      )}
      {page == 1 && (
        <CreatePageContent2 />
      )}
      
      {page == 3 && (
        <CreatePageContent3 />
      )}
      <ToastContainer />
    </>
  )
}

export default FeastCatalogueCreatePage