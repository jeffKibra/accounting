import { useSelector } from "react-redux";

function useAuth() {
  const userProfile = useSelector((store) => store.authReducer.userProfile);

  return userProfile;
}

export default useAuth;
