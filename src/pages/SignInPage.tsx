import { Card, CardBody, CardHeader, Checkbox } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthProvider';
import GenericInput from '../components/GenericInput';
import PrimaryButton from '../components/PrimaryButton';

const SignInPage = () => {
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
    login(email, password);
  }

  return (
    // <div className="flex w-full justify-center h-screen">
    //   <div className="flex w-1/2 flex-col justify-center items-center gap-4">
    //   <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //   <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    //   <Button 
    //     color="primary" 
    //     className="w-full" 
    //     onClick={handleSubmit}
    //   >
    //     Sign In
       
    //   </Button>
    //   </div>
    // </div>

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
        />
        <GenericInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
          value={password}
          onChange={setPassword}
        />
        <div className="flex py-2 px-1 justify-between">
          <Checkbox
            classNames={{
              label: "text-small",
            }}
          >
            Remember me
          </Checkbox>
          
          <Link to={""} className="text-primary">
            Forgot password?
          </Link>
        </div>
        <PrimaryButton 
          onClick={handleSubmit}
          className="m-auto w-[100%]"
        >
          Sign In
        </PrimaryButton>
      </CardBody>
    </Card>
    </div>
  )
}

export default SignInPage