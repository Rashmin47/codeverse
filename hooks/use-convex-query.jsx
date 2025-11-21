import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, args) => {
  // Normalize sentinel values: callers may pass the string "skip" (or "Skip")
  // to indicate the query should be skipped. Convex expects either an
  // object of arguments or undefined. Convert any string "skip" to
  // undefined so the underlying `useQuery` hook is called safely.
  const normalizedArgs =
    typeof args === "string" && args.toLowerCase() === "skip"
      ? undefined
      : args;

  const result = useQuery(query, normalizedArgs);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use effect to handle the state changes based on the query result
  useEffect(() => {
    if (result === undefined) {
      setIsLoading(true);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [result]);

  return {
    data,
    isLoading,
    error,
  };
};

export const useConvexMutation = (mutation) => {
  const mutationFn = useMutation(mutation);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};
