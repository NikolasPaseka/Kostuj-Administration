import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader,Switch,Select,SelectItem,Avatar,Divider} from "@heroui/react";
import {UserCircleIcon,Cog6ToothIcon,GlobeAltIcon,MoonIcon,SunIcon} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthProvider';
import { UserData } from '../../model/UserData';
import { resolveUiState, UiState, UiStateType } from '../../communication/UiState';
import { UserRepository } from '../../communication/repositories/UserRepository';
import UiStateHandler from '../../components/UiStateHandler';
import i18n from '../../translations/i18n';
import AdministrationSettings from './components/AdministrationSettings';
import GenericChip from '../../components/Controls/GenericChip';
import { authorizationRolesArray } from '../../model/AuthorizationRoles';
import VoiceControlSettings from './components/VoiceControlSettings';

const ProfileSettingsPage = () => {
  const { getUserData } = useAuth();

  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });

  const [userProfile, setUserProfile] = useState<UserData | null>();

  const [isDarkMode, setIsDarkMode] = useState<boolean>((localStorage.getItem("theme")) == "dark");
  const [language, setLanguage] = useState<string>(localStorage.getItem("language") || "cz");
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'cz', name: 'Czech' },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = getUserData()?.id;
      if (!userId) {
        setUiState({ type: UiStateType.ERROR, message: "User not found" });
        return;
      }
      const res = await UserRepository.getUserDataById(userId);
      setUserProfile(resolveUiState(res, setUiState));
    };

    fetchUserProfile();
  }, [getUserData]);

  return (
    <>
    <UiStateHandler uiState={uiState} />

    {userProfile &&
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card className="w-full">
          <CardHeader className="flex gap-2">
            <UserCircleIcon className="h-6 w-6" />
            <h4 className="text-xl font-bold">Profile Information</h4>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar
                  src={userProfile?.avatarImageUrl}
                  className="w-24 h-24"
                  alt={userProfile?.email}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{userProfile?.firstName} {userProfile?.lastName}</h3>
                  <p className="text-gray-500">{userProfile?.email}</p>
                </div>
                <div className="flex gap-8">
                  <div className='block'>
                    <label className="text-sm text-gray-500">Role</label>
                    <div className='flex gap-2'>
                      {authorizationRolesArray.map((auth) => 
                        userProfile.authorizations.includes(auth.value) && (
                          <GenericChip variant='flat'> {auth.label} </GenericChip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Member Since</label>
                    <p>{new Date(userProfile.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Settings Section */}
        <Card className="w-full">
          <CardHeader className="flex gap-2">
            <Cog6ToothIcon className="h-6 w-6" />
            <h4 className="text-xl font-bold">Settings</h4>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
                <span>Dark Mode</span>
              </div>
              <Switch
                isSelected={isDarkMode}
                onValueChange={(isSelected) => {
                  const darkModeState = isSelected;
                  localStorage.setItem("theme", darkModeState ? "dark": "light");
                  setIsDarkMode(darkModeState)
                }}
              />
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5" />
                <span>Language</span>
              </div>
              <Select
                label="Select Language"
                selectedKeys={[language]}
                className="w-full"
                onChange={(e) => {
                  const lang = e.target.value
                  setLanguage(lang);
                  i18n.changeLanguage(lang); localStorage.setItem("language", lang) 
                }}
              >
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Voice Input Settings */}
            <div className="space-y-2">
          
            </div>
          </CardBody>
        </Card>
        
        <div className='flex flex-row gap-8'>
          <AdministrationSettings />
          <VoiceControlSettings />
        </div>      
      </div>
    </div>
    }
    </>
  );
};

export default ProfileSettingsPage;