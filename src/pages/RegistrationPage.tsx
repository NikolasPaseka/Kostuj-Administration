import { useMemo, useState } from 'react'
import { CommunicationResult, isSuccess } from '../communication/CommunicationsResult';
import { UserAuth } from '../model/UserAuth';
import CardGeneric from '../components/CardGeneric';
import GenericInput from '../components/GenericInput';
import PrimaryButton from '../components/PrimaryButton';
import UiStateHandler from '../components/UiStateHandler';
import { resolveUiState, UiState, UiStateType } from '../communication/UiState';
import { AtSymbolIcon, UserIcon } from '@heroicons/react/24/solid';
import { validateEmailAddress, ValidationResult } from '../utils/validationUtils';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthProvider';
import { UserRepository } from '../communication/repositories/UserRepository';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '../utils/AppRoutes';
import Logo from '../assets/logo.svg';

const RegistrationPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.IDLE });
  const [checkValidations, setCheckValidations] = useState<boolean>(false);

  const { saveAuthResult } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleSubmit = async () => {  
    setCheckValidations(true);
    if (!validateEmail.isValid || !validatePassword.isValid || firstName.isEmpty() || lastName.isEmpty()) {
      return;
    }

    setUiState({ type: UiStateType.LOADING });
    const res: CommunicationResult<UserAuth> = await UserRepository.register(email, password, firstName, lastName); 
    if (isSuccess(res)) {
      saveAuthResult(res.data);
      navigate(AppRoutes.HOME);
    }
    resolveUiState(res, setUiState);
  }

  const validateEmail = useMemo((): ValidationResult => {
    if (email.isEmpty()) { return { isValid: false, errorMessage: "Empty email address"} }

    return { isValid: validateEmailAddress(email), errorMessage: "Invalid email address" };
  }, [email]);

  const validatePassword = useMemo((): ValidationResult => {
    if (password.isEmpty()) { return { isValid: false, errorMessage: "Empty password"} }
    if (password !== passwordRepeat) { return { isValid: false, errorMessage: "Passwords do not match"} }

    return { isValid: true };
  }, [password, passwordRepeat]);

  return (
    <div className="flex w-full h-screen items-center justify-center">
    <CardGeneric 
      header={
        <div className='flex flex-1 items-center gap-4'>
          <h1 className="text-2xl font-bold flex-1">Fill in data to register to Koštuj</h1>
          <img src={Logo} alt="App Logo" className="w-20" />
        </div>
      }
      className="flex-1 max-w-xl p-8"
    >
      <div className="flex flex-col gap-4">
      <div>
        <GenericInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          isInvalid={checkValidations && !validateEmail.isValid}
          errorMessage={validateEmail.errorMessage}
          startContent={<AtSymbolIcon />}
        />
        <GenericInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={setPassword}
          isInvalid={checkValidations && !validatePassword.isValid}
          errorMessage={validatePassword.errorMessage}
          startContent={<LockClosedIcon />}
        />
        <GenericInput
          label="Password"
          placeholder="Repeat your password"
          type="password"
          value={passwordRepeat}
          onChange={setPasswordRepeat}
          isInvalid={checkValidations && !validatePassword.isValid}
          errorMessage={validatePassword.errorMessage}
          startContent={<LockClosedIcon />}
        />
        <div className="flex gap-4">
          <GenericInput
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChange={setFirstName}
            isInvalid={checkValidations && firstName.isEmpty()}
            errorMessage={"First name cannot be empty"}
            startContent={<UserIcon />}
          />
          <GenericInput
            label="Last Name"
            placeholder="Enter your last name"
            value={lastName}
            onChange={setLastName}
            isInvalid={checkValidations && lastName.isEmpty()}
            errorMessage={"Last name cannot be empty"}
            startContent={<UserIcon />}
          />
        </div>
      </div>

      <PrimaryButton 
        onClick={handleSubmit}
        className="m-auto w-[100%]"
      >
        Register
      </PrimaryButton>

      <UiStateHandler uiState={uiState} />
      </div>
    </CardGeneric>
  </div>
  )
}

export default RegistrationPage