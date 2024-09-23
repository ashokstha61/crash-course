import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);
const GlobalProvoder = ({ children }) => {
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then((res) => {
        if (isMounted) {
          if (res) {
            setIsLoggedIn(true);
            setUser(res);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        IsLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        IsLoading
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvoder;
