import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("token"))
  );
  const [avatar, setAvatar] = useState(
    JSON.parse(localStorage.getItem("avatar"))
  );
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(isLoggedIn));
    localStorage.setItem("avatar", JSON.stringify(avatar));
    localStorage.setItem("user", JSON.stringify(userId));
  }, [isLoggedIn, avatar, userId]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        avatar,
        setAvatar,
        userId,
        setUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
