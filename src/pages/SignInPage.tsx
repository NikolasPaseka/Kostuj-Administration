import { Checkbox } from "@heroui/react"
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthProvider';
import GenericInput from '../components/GenericInput';
import PrimaryButton from '../components/PrimaryButton';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import AppRoutes from '../utils/AppRoutes';
import { resolveUiState, UiState, UiStateType } from '../communication/UiState';
import UiStateHandler from '../components/UiStateHandler';
import { validateEmailAddress, ValidationResult } from '../utils/validationUtils';
import CardGeneric from '../components/CardGeneric';
import Logo from '../assets/logo.svg?url';

const SignInPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.IDLE })

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [checkValidations, setCheckValidations] = useState<boolean>(false);

  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async () => {
    setCheckValidations(true);
    if (!validateEmail.isValid || !validatePassword.isValid) { return; }

    setUiState({ type: UiStateType.LOADING })
    const res = await login(email, password);
    resolveUiState(res, setUiState);
  }

  const validateEmail = useMemo((): ValidationResult => {
    if (email.isEmpty()) { return { isValid: false, errorMessage: "Empty email address"} }

    return { isValid: validateEmailAddress(email), errorMessage: "Invalid email address" };
  }, [email]);

  const validatePassword = useMemo((): ValidationResult => {
    if (password.isEmpty()) { return { isValid: false, errorMessage: "Empty password"} }

    return { isValid: true };
  }, [password]);


  return (
    <div className="flex w-full h-screen items-center justify-center">
      <CardGeneric 
        header={
          <div className='flex flex-1 items-center gap-4'>
            <h1 className="text-2xl font-bold flex-1">Sign In to Koštuj</h1>
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
        </div>
        <div className="flex py-2 px-1 justify-between">
          <Checkbox
            classNames={{
              label: "text-small",
            }}
          >
            Remember me
          </Checkbox>
          
          <Link to={AppRoutes.REGISTER} className="text-primary">
            Create account here
          </Link>
        </div>
        <PrimaryButton 
          onClick={handleSubmit}
          className="m-auto w-[100%]"
        >
          Sign In
        </PrimaryButton>

        <UiStateHandler uiState={uiState} />
        </div>
      </CardGeneric>
    </div>
  )
}

export default SignInPage