import { Button } from "@heroui/react";
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { i18n } = useTranslation();

  return (
    <div>
       <h1>Settings</h1>
      <Button onClick={() => { i18n.changeLanguage("cz"); localStorage.setItem("language", "cz") }}>cz</Button>
      <Button onClick={() => { i18n.changeLanguage("en"); localStorage.setItem("language", "en") }}>en</Button>
    </div>
  )
}

export default SettingsPage