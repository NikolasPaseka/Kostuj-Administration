import { Card, CardBody, CardHeader, Checkbox } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthProvider';
import GenericInput from '../components/GenericInput';
import PrimaryButton from '../components/PrimaryButton';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import AppRoutes from '../utils/AppRoutes';
import { resolveUiState, UiState, UiStateType } from '../communication/UiState';
import UiStateHandler from '../components/UiStateHandler';

const SignInPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.IDLE })

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async () => {  
    setUiState({ type: UiStateType.LOADING })
    const res = await login(email, password);
    resolveUiState(res, setUiState);
  }

  return (

    <div className="flex w-full h-screen items-center justify-center">
      <Card className="flex-1 max-w-xl p-8">
      <CardHeader>
        <h1 className="text-2xl font-bold">Sign In to Koštuj</h1>
      </CardHeader>
      <CardBody className='gap-5'>
        <GenericInput
          label="Email"
          placeholder="Enter your email"
          variant="bordered"
          value={email}
          onChange={setEmail}
          startContent={<AtSymbolIcon />}
        />
        <GenericInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
          value={password}
          onChange={setPassword}
          startContent={<LockClosedIcon />}
        />
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
      </CardBody>
    </Card>
    </div>
  )
}

export default SignInPage