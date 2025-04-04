import { HomeIcon, UserIcon, ArrowLeftEndOnRectangleIcon, BookmarkSquareIcon, BuildingStorefrontIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { Button, Divider } from "@heroui/react";
import SidebarItem from './SidebarItem';
import { useAuth } from '../../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from "../../translations/i18n";
import Logo from '../../assets/logo.svg?url';
import { useEffect, useState } from 'react';
import { TypeChecker } from '../../utils/TypeChecker';
import AppRoutes from '../../utils/AppRoutes';

const Sidebar = (
  { showFull }: { showFull?: boolean }
) => {
  const { logout, getUserData } = useAuth();
  const { t } = useTranslation();

  const userData = getUserData();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768)
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  const showFullFinal = showFull && !isSmallScreen;

  return (
    <div className={`h-screen ${showFullFinal ? "w-64" : "w-20"} flex flex-col bg-lightContainer rounded-xl sticky top-0 shadow-lg`}>
      <div className={`flex items-center justify-center ${showFullFinal ? "mr-4" : ""} py-8 gap-2`}>
        <img src={Logo} alt="React Logo" className="w-14" />
        { showFullFinal &&
          <div className="justify-self-center">
            <h1 className="text-3xl font-bold">Koštuj</h1>
            <p className="text-sm text-gray-500">Administration</p>
          </div>
        }
        
      </div>
      <nav className="flex-1 flex items-center flex-col mt-4">
        <SidebarItem 
          path={AppRoutes.HOME} 
          text={showFullFinal ? t("home", { ns: TranslationNS.sidebar }) : undefined} 
          Icon={HomeIcon} 
        />
        <SidebarItem 
          path={AppRoutes.FEAST_CATALOGUES}
          text={showFullFinal ? t("catalogues", { ns: TranslationNS.sidebar }) : undefined} 
          Icon={BookmarkSquareIcon} 
        />
        <SidebarItem 
            path={AppRoutes.WINERIES_MANAGEMENT}
            text={showFullFinal ? "Správa vinařství" : undefined} 
            Icon={BuildingStorefrontIcon} 
        />
        { userData && TypeChecker.isArray(userData.authorizations) && userData.authorizations.includes(100) && 
          <SidebarItem 
            path={AppRoutes.USERS_MANAGEMENT}
            text={showFullFinal ? t("usersManagement", { ns: TranslationNS.sidebar }) : undefined} 
            Icon={UserGroupIcon} 
          />
        }
        {/* <SidebarItem path="/signIn" text={t("signIn", { ns: TranslationNS.sidebar })} Icon={KeyIcon} /> */}
        {/* <SidebarItem path="/voiceTest" text={t("home", { ns: TranslationNS.sidebar })} Icon={MicrophoneIcon} /> */}
        <SidebarItem 
          path={AppRoutes.PROFILE_AND_SETTINGS} 
          text={showFullFinal ? t("profile", { ns: TranslationNS.sidebar }) : undefined} 
          Icon={UserIcon} 
        />
      </nav>
      <Divider />
      { userData && showFullFinal && <div className="p-4">
          <p className="text-center">Logged in as {userData?.email}</p>
        </div>
      }
      <div className="p-4">
        <Button color="primary" className={`${showFullFinal ? "w-full" : "min-w-8"}`} onPress={() => {
            logout();
        }}>
          {showFullFinal ? "Logout" : <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar