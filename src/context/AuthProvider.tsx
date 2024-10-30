// src/context/AuthContext.js
import axios from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../model/UserAuth';
import { UserRepository } from '../communication/repositories/UserRepository';
import { CommunicationResult, isSuccess } from '../communication/CommunicationsResult';

type AuthContextType = {
    accessToken: string | null,
    setAccessToken: (newToken: string | null) => void,
    login: (email: string, password: string) => Promise<CommunicationResult<UserAuth>>,
    logout: () => void,
    isLoggedIn: () => boolean,
    getUserData: () => UserAuth | null
    saveAuthResult: (userAuth: UserAuth) => void
};

type Props = { children: React.ReactNode };
  
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));

    const [isReady, setIsReady] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setAccessToken(token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
    }, []);

    const login = async (email: string, password: string): Promise<CommunicationResult<UserAuth>> => {
        const res = await UserRepository.login(email, password);
        console.log(res)

        if (isSuccess(res)) {
            const userAuth: UserAuth = res.data;
            saveAuthResult(userAuth);
            navigate("/");
        }
        return res;
    };

    const saveAuthResult = (userAuth: UserAuth) => {
      setAccessToken(userAuth.accessToken);
      localStorage.setItem("accessToken", userAuth.accessToken);
      localStorage.setItem("userAuth", JSON.stringify(userAuth));
    }
    
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userAuth");
        setAccessToken(null);
        navigate("/signIn");
    };

    const isLoggedIn = (): boolean => { return accessToken != null; }

    const getUserData = (): UserAuth | null => {
        const userAuth = localStorage.getItem("userAuth");
        if (userAuth) {
            return JSON.parse(userAuth);
        }
        return null;
    }

    return (
        <AuthContext.Provider
            value={{ accessToken, setAccessToken, logout, login, isLoggedIn, getUserData, saveAuthResult }}
        >
      {isReady ? children : null}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};