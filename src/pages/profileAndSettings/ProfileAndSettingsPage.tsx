import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader,Switch,Select,SelectItem,Slider,Avatar,Divider} from "@nextui-org/react";
import {UserCircleIcon,Cog6ToothIcon,GlobeAltIcon,MoonIcon,SunIcon,MicrophoneIcon} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthProvider';
import { UserData } from '../../model/UserData';
import { resolveUiState, UiState, UiStateType } from '../../communication/UiState';
import { UserRepository } from '../../communication/repositories/UserRepository';
import UiStateHandler from '../../components/UiStateHandler';
import i18n from '../../translations/i18n';

const ProfileSettingsPage = () => {
  const { getUserData } = useAuth();

  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });

  const [userProfile, setUserProfile] = useState<UserData | null>();

  const [isDarkMode, setIsDarkMode] = useState<boolean>((localStorage.getItem("theme")) == "dark");
  const [language, setLanguage] = useState<string>(localStorage.getItem("language") || "cz");
  const [voiceDelay, setVoiceDelay] = useState(500);
  
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <p>{userProfile?.authorizations}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Member Since</label>
                    <p>{"datum"}</p>
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
              <div className="flex items-center gap-2">
                <MicrophoneIcon className="h-5 w-5" />
                <span>Voice Input Delay</span>
              </div>
              <div className="space-y-2">
                <Slider
                  aria-label="Voice input delay"
                  value={voiceDelay}
                  onChange={(value) => setVoiceDelay(value as number)}
                  minValue={200}
                  maxValue={2000}
                  step={100}
                  className="max-w-md"
                />
                <p className="text-sm text-gray-500">{voiceDelay}ms</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
    }
    </>
  );
};

export default ProfileSettingsPage;