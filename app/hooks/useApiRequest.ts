import { useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "~/store/store";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

export const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const shopAndHost = useSelector((state: IRootState) => state.shopAndHost);
  const authFetch = useAuthenticatedFetch(shopAndHost.host);

  const processApiCall = async (url: string, method: string, body?: Record<string, string | boolean | number>) => {
    try {
      setIsLoading(true);
      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        const errorData = await response.json();
        setIsLoading(false);
        return { error: errorData, status: response.status };
      }
      setIsLoading(false);
      return await response.json();
    } catch (error) {
      setIsLoading(false);
      return { error };
    }
  };
  return { processApiCall, isLoading }
}
