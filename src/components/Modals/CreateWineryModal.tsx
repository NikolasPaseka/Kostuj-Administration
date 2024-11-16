import { useEffect, useState } from 'react'
import { Winery } from '../../model/Winery'
import ModalDialog from '../ModalDialog'
import CatalogueInputField from '../../pages/feastCatalogueCreate/components/CatalogueInputField'
import { AtSymbolIcon, ClipboardDocumentIcon, MapPinIcon } from '@heroicons/react/24/solid'
import { useTranslation } from 'react-i18next'
import { TranslationNS } from '../../translations/i18n'
import { WineryDomainUtil } from '../../model/Domain/WineryDomainUtil'
import { useAuth } from '../../context/AuthProvider'
import { WineryRepository } from '../../communication/repositories/WineryRepository'
import { isSuccess } from '../../communication/CommunicationsResult'
import StateMessage from '../StateMessage'

type Props = {
  winery?: Winery,
  wineryName?: string,
  isOpen: boolean,
  onOpenChange: () => void,
  onWineryCreateOrEdit: (winery: Winery) => void
}

const CreateWineryModal = ({ winery, wineryName, isOpen, onOpenChange, onWineryCreateOrEdit }: Props) => {
  const { t } = useTranslation();
  const { getUserData } = useAuth();

  const [adminsWineries, setAdminsWineries] = useState<Winery[]>([])
  const [wineryTitle, setWineryTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [webAddress, setWebAddress] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const fetchAdminWineries = async () => {
    const res = await WineryRepository.getAdminsWineries();
    if (isSuccess(res)) {
      setAdminsWineries(res.data)
    }
  }

  useEffect(() => {
    if (winery !== undefined) {
      setWineryTitle(winery.name)
      setEmail(winery.email ?? "")
      setPhoneNumber(winery.phoneNumber ?? "")
      setWebAddress(winery.websitesUrl)
      setAddress(winery.address)
    }
    if (wineryName !== undefined) {
      setWineryTitle(wineryName)
    }
  }, [winery, wineryName])

  useEffect(() => {
    fetchAdminWineries()
  }, [])

  const checkWineryExists = () => {
    const adminWineriesFiltered = inEdit ? adminsWineries.filter(w => w.id !== winery.id) : adminsWineries
    return WineryDomainUtil.checkWineryExists(adminWineriesFiltered, wineryTitle, address)
  }

  const inEdit = winery !== undefined
  const allRequiredFieldsFilled = wineryTitle !== "" && address !== ""

  const createOrEditWinery = async () => {
    const adminId = getUserData()?.id
    if (adminId === undefined) { return; }
    if (inEdit) {
      // edit winery
      const updatedWinery = WineryDomainUtil.createWineryEntry(wineryTitle, email, phoneNumber, webAddress, address, adminId, winery?.id)
      const res = await WineryRepository.updateWinery(updatedWinery)
      if (isSuccess(res)) {
        onWineryCreateOrEdit(res.data)
      }
    } else {
      // create winery
      const newWinery = WineryDomainUtil.createWineryEntry(wineryTitle, email, phoneNumber, webAddress, address, adminId)
      const res = await WineryRepository.createWinery(newWinery)
      if (isSuccess(res)) {
        onWineryCreateOrEdit(res.data)
      }
    }
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={() => { 
        createOrEditWinery()
      }}
      header={inEdit ? "Edit Winery" : "Create Winery"}
      confirmButtonDisabled={!allRequiredFieldsFilled || checkWineryExists()}
      onCloseAction={() => {
        setWineryTitle("")
        setEmail("")
        setPhoneNumber("")
        setWebAddress("")
        setAddress("")
      }}
    > 
      <CatalogueInputField
        value={wineryTitle}
        onValueChange={setWineryTitle}
        label={t("winery", { ns: TranslationNS.catalogues })} 
        placeholder={t("wineryPlaceholder", { ns: TranslationNS.catalogues })}
        StartContent={ClipboardDocumentIcon}
        isRequired
      />

      <CatalogueInputField
        value={address}
        onValueChange={setAddress} 
        label={t("placeAndAddress", { ns: TranslationNS.catalogues })}
        placeholder={t("placeAndAddressPlaceholder", { ns: TranslationNS.catalogues })}
        StartContent={MapPinIcon}
        isRequired
      />

      <CatalogueInputField
        value={email}
        onValueChange={setEmail}
        label={t("emailAddress", { ns: TranslationNS.catalogues })} 
        placeholder={t("emailAddressPlaceholder", { ns: TranslationNS.catalogues })}
        StartContent={AtSymbolIcon}
      />

      <CatalogueInputField 
        value={phoneNumber} 
        onValueChange={setPhoneNumber} 
        label={t("phoneNumber", { ns: TranslationNS.catalogues })}
        placeholder={t("phoneNumberPlaceholder", { ns: TranslationNS.catalogues })}
        StartContent={MapPinIcon}
      />

      <CatalogueInputField 
        value={webAddress} 
        onValueChange={setWebAddress} 
        label="Web Address" 
        placeholder="Input Web Address"
        StartContent={MapPinIcon}
      />

      {checkWineryExists() && allRequiredFieldsFilled && 
        <StateMessage 
          text={<p>Winery with this name and address already exists!</p>}
          stateMessageType="error"
        />
      }
    </ModalDialog>
  )
}

export default CreateWineryModal