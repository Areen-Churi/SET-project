"use client"

import React, { createContext } from "react"

import {auth} from '../../lib/firebase'
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import {useAuthState} from "react-firebase-hooks/auth"


export interface User {
    uid: string,
    photoURL: string,
    displayName: string,
}
export interface AuthType {
    user: User | null,
    loading: boolean,
    googleLoginHandler: () => Promise<void>,
    logout: () => Promise<void>
}

export const authContext = createContext<AuthType>({
    user: null,
    loading: false,
    googleLoginHandler: async () => {},
    logout: async () => {}
})

export default function AuthContextProvider({children}: {
    children: React.ReactNode;
}){
    const[user, loading] = useAuthState(auth);

    const googleProvider = new GoogleAuthProvider();

    const googleLoginHandler = async () => {
        try{
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        signOut(auth);
    };

    const values = {
        user,
        loading,
        googleLoginHandler,
        logout
    } as AuthType

    return <authContext.Provider value={values}>{children}</authContext.Provider>
}