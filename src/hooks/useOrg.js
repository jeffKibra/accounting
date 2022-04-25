import { useSelector } from "react-redux";

function useOrg() {
  const org = useSelector((state) => state.orgsReducer.org);

  return org;
}

export default useOrg;
