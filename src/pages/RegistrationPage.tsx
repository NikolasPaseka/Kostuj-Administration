import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import { axiosCall } from '../communication/axios';
import { CommunicationResult } from '../communication/CommunicationsResult';
import { UserAuth } from '../model/UserAuth';

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleSubmit = async (e: any) => {  
    if (password !== passwordRepeat) {
      console.log("password do not match");
      return;
    }

    const res: CommunicationResult<UserAuth> = await axiosCall("/users/register", "POST", {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    console.log(res);

  }

  return (
    <div className="flex w-full justify-center h-screen">
      <div className="flex w-1/2 flex-col justify-center items-center gap-4">
      <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="text" label="FirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <Input type="test" label="LastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Input type="password" label="Password Repeat" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} />
      <Button 
        color="primary" 
        className="w-full" 
        onPress={handleSubmit}
      >
        Register
      </Button>
      </div>
    </div>
  )
}

export default RegistrationPage