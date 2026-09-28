
import { createContext, useContext,useEffect,useState } from "react";
 import api from "../services/api.js";
 const AuthContext =createContext();
 export function AuthProvider({children}){
    const [user,setUser]= useState(null);
    const [loading,setLoading]= useState(true);
    // get current login-in user
     const fetchCurrentUser= async()=>{
        try{
            const token =localStorage.getItem("token");
            // no token means user is not logged in 
            if(!token){
                setUser(null);
                return;

            }
             const response= await api.get("/auth/me");
             
             setUser(response.data.data);
             
        }catch(error){
            console.error(
                "fetch current user error",
                error.response?.data || error.message
            );
            // token may be invalid /expired 
            localStorage.removeItem("token");
            setUser(null);

        }finally{
            setLoading(false);

        }
     };

     useEffect(()=>{
 fetchCurrentUser();
     } ,[]);

     const logout= ()=>{
        localStorage.removeItem("token");
        setUser(null);

     };

      return (
        <AuthContext.Provider
        value={{
user,
loading,
logout,
fetchCurrentUser,

        }}
        >
            {children}
        </AuthContext.Provider>
      );

 }

 export function useAuth(){
    return useContext(AuthContext);
    
 }