import { HomeIcon, UserIcon, Cog6ToothIcon, KeyIcon, MicrophoneIcon } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import SidebarItem from './SidebarItem';
import { useAuth } from '../../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from "../../translations/i18n";

const Sidebar = () => {
  const { logout, getUserData } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="h-screen w-64 flex flex-col bg-lightContainer rounded-xl sticky top-0">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-2xl font-bold">Koštuj</h1>
      </div>
      <nav className="flex-1 flex items-center flex-col mt-4">
        <SidebarItem path="/" text={t("home", { ns: TranslationNS.sidebar })} Icon={HomeIcon} />
        <SidebarItem path="/profile" text={t("profile", { ns: TranslationNS.sidebar })} Icon={UserIcon} />
        <SidebarItem path="/feastCatalogues" text={t("catalogues", { ns: TranslationNS.sidebar })} Icon={Cog6ToothIcon} />
        <SidebarItem path="/signIn" text={t("signIn", { ns: TranslationNS.sidebar })} Icon={KeyIcon} />
        <SidebarItem path="/voiceTest" text={t("home", { ns: TranslationNS.sidebar })} Icon={MicrophoneIcon} />
        <SidebarItem path="/settings" text={t("settings", { ns: TranslationNS.sidebar })} Icon={Cog6ToothIcon} />
      </nav>
      { getUserData() && <div className="p-4">
          <p className="text-center">Logged in as {getUserData()?.email}</p>
        </div>
      }
      <div className="p-4">
        <Button color="primary" className="w-full" onPress={() => {
            logout();
        }}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar