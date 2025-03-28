import { useEffect, useState } from 'react'
import CardGeneric from '../../../components/CardGeneric'
import { MicrophoneIcon } from '@heroicons/react/24/outline'
import { UserAdministrationSettings } from '../../../model/UserAdministrationSettings';
import { resolveUiState, UiState, UiStateType } from '../../../communication/UiState';
import { CircularProgress, Kbd, Slider, Switch } from '@heroui/react';
import { UserRepository } from '../../../communication/repositories/UserRepository';
import CheckboxGeneric from '../../../components/Controls/CheckboxGeneric';

const VoiceControlSettings = () => {
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
          <MicrophoneIcon className="h-6 w-6" />
          <h4 className="text-xl font-bold">Voice Control Settings</h4>
        </div>
      }
    >
      {uiState.type == UiStateType.LOADING && <CircularProgress className='w-full self-center' />}
      {uiState.type == UiStateType.ERROR && <div>{uiState.message}</div>}
      {uiState.type == UiStateType.SUCCESS && userAdministrationSettings != null && (
        <div className='flex flex-col gap-4'>
          <Switch isSelected={userAdministrationSettings?.enableVoiceControl} onValueChange={(state: boolean) => updateAdministrationSettings({ ...userAdministrationSettings, enableVoiceControl: state })}>
            Enable Voice Control
          </Switch>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span>Voice Input Delay</span>
              <p className="text-sm text-gray-500">{userAdministrationSettings.voiceControlDelay}ms</p>
            </div>
            <div className="space-y-2">
              <Slider
                aria-label="Voice input delay"
                value={userAdministrationSettings?.voiceControlDelay}
                onChange={(value) => updateAdministrationSettings({ ...userAdministrationSettings, voiceControlDelay: value as number })}
                minValue={200}
                maxValue={2000}
                step={100}
                className="max-w-md"
                color='primary'
                isDisabled={!userAdministrationSettings?.enableVoiceControl}
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <CheckboxGeneric
              value={userAdministrationSettings.voiceControlPushToTalk}
              onChange={(state: boolean) => {
                updateAdministrationSettings({ ...userAdministrationSettings, voiceControlPushToTalk: state });
              }}
              isDisabled={!userAdministrationSettings?.enableVoiceControl}
            >
              Push To Talk
            </CheckboxGeneric>
            <Kbd keys={["option", "command"]}>P</Kbd>
          </div>
        </div>
      )}

    </CardGeneric>
  )
}

export default VoiceControlSettings