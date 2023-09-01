import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function useURLSearchParamsQuery() {
  const { search } = useLocation();

  const query = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  return query;
}
