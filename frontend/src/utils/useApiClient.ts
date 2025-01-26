import { useCallback } from "react";

export const useApiClient = () => {
  const baseUrl = import.meta.env.VITE_API_BASEURL;
  const headers = {
    "Cotent-Type": "application/json"
  };

  const get = useCallback(
    async <T>(path: string): Promise<T> => {
      const response = await fetch(baseUrl + path, {
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
    }, []
  )

  return { get };
}