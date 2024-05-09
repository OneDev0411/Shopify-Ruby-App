import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/store";

/**
 * A hook for querying your custom app data.
 * @desc A thin wrapper around useAuthenticatedFetch and react-query's useQuery.
 *
 * @param {Object} options - The options for your query. Accepts 3 keys:
 *
 * 1. url: The URL to query. E.g: /api/widgets/1`
 * 2. fetchInit: The init options for fetch.  See: https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
 * 3. reactQueryOptions: The options for `useQuery`. See: https://react-query.tanstack.com/reference/useQuery
 *
 * @returns Return value of useQuery.  See: https://react-query.tanstack.com/reference/useQuery.
 */

interface IUseAppQueryProps {
  url: string,
  options?: RequestInit,
  reactQueryOptions: {
    onSuccess: () => void
  }
}

export const useAppQuery = ({ url, options = {}, reactQueryOptions }: IUseAppQueryProps) => {
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const authenticatedFetch = useAuthenticatedFetch(shopAndHost.host);
  const fetchOptions = JSON.stringify(options);
  const fetch = useMemo(() => {
    return async () => {
      const response = await authenticatedFetch(url, options);
      return response.json();
    };
  }, [url, fetchOptions]);

  return useQuery(url, fetch, {
    ...reactQueryOptions,
    refetchOnWindowFocus: false,
  });
};
