"use client";

import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

interface UseAxiosFetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

const useAxiosFetch = <T = unknown,>(
  url: string,
  config?: AxiosRequestConfig
): UseAxiosFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: AxiosResponse<T> = await axios(url, config);
        setData(response.data);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, config]);

  return { data, error, isLoading };
};

export default useAxiosFetch;
