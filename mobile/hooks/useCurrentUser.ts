import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { useAuth } from "@clerk/clerk-expo";

export const useCurrentUser = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  const {
    data: currentUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => userApi.getCurrentUser(api),
    select: (response) => response.data,
    enabled: isSignedIn,
  });

  return { currentUser, isLoading, error, refetch };
};