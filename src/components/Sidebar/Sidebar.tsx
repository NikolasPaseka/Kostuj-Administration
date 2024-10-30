import { HomeIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { Button, Divider } from '@nextui-org/react';
import SidebarItem from './SidebarItem';
import { useAuth } from '../../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from "../../translations/i18n";
import Logo from '../../assets/logo.svg';

const Sidebar = () => {
  const { logout, getUserData } = useAuth();
  const { t } = useTranslation();

  const userData = getUserData();

  return (
    <div className="h-screen w-64 flex flex-col bg-lightContainer rounded-xl sticky top-0 shadow-lg">
      <div className="flex items-center justify-center mr-4 py-8 gap-2">
        <img src={Logo} alt="React Logo" className="w-14" />
        <div className="justify-self-center">
          <h1 className="text-3xl font-bold">Koštuj</h1>
          <p className="text-sm text-gray-500">Administration</p>
        </div>
        
      </div>
      <nav className="flex-1 flex items-center flex-col mt-4">
        <SidebarItem path="/" text={t("home", { ns: TranslationNS.sidebar })} Icon={HomeIcon} />
        <SidebarItem path="/feastCatalogues" text={t("catalogues", { ns: TranslationNS.sidebar })} Icon={Cog6ToothIcon} />
        {/* <SidebarItem path="/signIn" text={t("signIn", { ns: TranslationNS.sidebar })} Icon={KeyIcon} /> */}
        {/* <SidebarItem path="/voiceTest" text={t("home", { ns: TranslationNS.sidebar })} Icon={MicrophoneIcon} /> */}
        <SidebarItem path="/profile" text={t("profile", { ns: TranslationNS.sidebar })} Icon={UserIcon} />
        <SidebarItem path="/settings" text={t("settings", { ns: TranslationNS.sidebar })} Icon={Cog6ToothIcon} />
        { userData?.authorizations.includes(100) && 
          <SidebarItem path="/usersManagement" text={t("usersManagement", { ns: TranslationNS.sidebar })} Icon={UserIcon} />
        }
      </nav>
      <Divider />
      { userData&& <div className="p-4">
          <p className="text-center">Logged in as {userData?.email}</p>
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