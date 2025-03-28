import CardGeneric from '../../../components/CardGeneric'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import CheckboxGeneric from '../../../components/Controls/CheckboxGeneric'
import { UserAdministrationSettings } from '../../../model/UserAdministrationSettings';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@heroui/react';
import { UserRepository } from '../../../communication/repositories/UserRepository';
import { resolveUiState, UiState, UiStateType } from '../../../communication/UiState';

const AdministrationSettings = () => {
  const [userAdministrationSettings, setUserAdministrationSettings] = useState<UserAdministrationSettings | null>();
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });

  useEffect(() => {
    const fetchUserAdministrationSettings = async () => {
      const res = await UserRepository.getAdministrationSettings();
      const data = resolveUiState(res, setUiState);
      setUserAdministrationSettings(data);
    };

    fetchUserAdministrationSettings();
  }, [])

  const updateAdministrationSettings = (settings: UserAdministrationSettings) => {
    setUserAdministrationSettings(settings);
    UserRepository.updateAdministrationSettings(settings);
  }

  return (
    <CardGeneric
      className="w-full"
      showDivider={true}
      header={
        <div className="flex gap-2">
          <Cog6ToothIcon className="h-6 w-6" />
          <h4 className="text-xl font-bold">Administration Settings</h4>
        </div>
      }
    >
      {uiState.type == UiStateType.LOADING && <CircularProgress className='w-full self-center' />}
      {uiState.type == UiStateType.ERROR && <div>{uiState.message}</div>}
      {uiState.type == UiStateType.SUCCESS && userAdministrationSettings != null && (
        <div className='flex flex-col gap-4'>
          <CheckboxGeneric
            value={userAdministrationSettings.keepWineName}
            onChange={(state: boolean) => {
              updateAdministrationSettings({ ...userAdministrationSettings, keepWineName: state });
            }}
          >
            Keep Wine Name
          </CheckboxGeneric>

          <CheckboxGeneric
            value={userAdministrationSettings.keepWinery}
            onChange={(state: boolean) => {
              updateAdministrationSettings({ ...userAdministrationSettings, keepWinery: state });
            }}
          >
            Keep Winery
          </CheckboxGeneric>

          <CheckboxGeneric
            value={userAdministrationSettings.keepWineYear}
            onChange={(state: boolean) => {
              updateAdministrationSettings({ ...userAdministrationSettings, keepWineYear: state });
            }}
          >
            Keep Wine Year
          </CheckboxGeneric>

          <CheckboxGeneric
            value={userAdministrationSettings.keepWineColor}
            onChange={(state: boolean) => {
              updateAdministrationSettings({ ...userAdministrationSettings, keepWineColor: state });
            }}
          >
            Keep Wine Color
          </CheckboxGeneric>

          <CheckboxGeneric
            value={userAdministrationSettings.keepWineAttribute}
            onChange={(state: boolean) => {
              updateAdministrationSettings({ ...userAdministrationSettings, keepWineAttribute: state });
            }}
          >
            Keep Wine Attribute
          </CheckboxGeneric>

          <CheckboxGeneric
            value={userAdministrationSettings.autoIncreaseSampleNumber}
            onChange={(state: boolean) => {
              updateAdministrationSettings({ ...userAdministrationSettings, autoIncreaseSampleNumber: state });
            }}
          >
            Auto increase sample number
          </CheckboxGeneric>
        </div>
      )}
    </CardGeneric>
  )
}

export default AdministrationSettings