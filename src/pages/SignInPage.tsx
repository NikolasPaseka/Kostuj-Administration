import { Button, Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthProvider';

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
    <div className="flex w-full justify-center h-screen">
      <div className="flex w-1/2 flex-col justify-center items-center gap-4">
      <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button 
        color="primary" 
        className="w-full" 
        onClick={handleSubmit}
      >
        Sign In
       
      </Button>
      </div>
    </div>
  )
}

export default SignInPage