import { useGetCurrentUser, useGetCurrentUserQuery } from "@/lib/react-query/queries";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_USER = {
    $id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
    save: [],
    liked: []
};

interface IContext {
    user: IUser
    isLogin: boolean | undefined;
    checkLogin: () => Promise<boolean>
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLogin: undefined,
    checkLogin: async () => false as boolean
};

const DataContext = createContext<IContext>(INITIAL_STATE)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLogin, setIsLogin] = useState<boolean | undefined>(INITIAL_STATE.isLogin);
    const navigate = useNavigate();

    const { data: getCurrentUserQuery } = useGetCurrentUserQuery();
    const { mutateAsync: getCurrentUser } = useGetCurrentUser();

    const checkLogin = async () => {

        const response = await getCurrentUser();
        if (response?.total === 1) {
            setIsLogin(true);
            return true;
        }
        setIsLogin(false)
        return false;
    }

    useEffect(() => {
        const data = getCurrentUserQuery?.documents.length && getCurrentUserQuery?.documents[0];
        if (data) {
            setUser({
                $id: data.$id,
                name: data.name,
                username: data.username,
                email: data.email,
                imageUrl: data.imageUrl,
                imageId: data.imageId,
                bio: data.bio,
                save: data.save,
                likes: data.likes
            });


        }
    }, [getCurrentUserQuery])

    useEffect(() => {
        const cookie = localStorage.getItem("cookieFallback");
        if (cookie === '[]' || cookie === undefined || cookie === null) {
            setIsLogin(false);
            navigate("/sign-in");
        } else
            checkLogin();


    }, [])

    const value = { isLogin, checkLogin, user };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export const useAuthContext = () => useContext(DataContext);