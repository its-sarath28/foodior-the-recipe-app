import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const Logout = () => {
  const { setIsLoggedIn, setAvatar, setUserId } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    setAvatar(null);
    setIsLoggedIn(null);
    setUserId(null);

    navigate("/auth/sign-in");
  }, [navigate, setIsLoggedIn, setAvatar]);

  return null;
};

export default Logout;
