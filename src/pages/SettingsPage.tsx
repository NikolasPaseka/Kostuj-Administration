import { Button } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
       <h1>{t("Welcome to React")}</h1>
      <Button onClick={() => { i18n.changeLanguage("cz"); localStorage.setItem("language", "cz") }}>cz</Button>
      <Button onClick={() => { i18n.changeLanguage("en"); localStorage.setItem("language", "en") }}>en</Button>
    </div>
  )
}

export default SettingsPage