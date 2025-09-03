import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query"; // for modifying user data
import { useAuth } from "@clerk/clerk-expo"; // for authentication
import { useApiClient, userApi } from "../utils/api"; // for API calls

export const useUserSync = () => { // function to sync user data
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  const syncUserMutation = useMutation({ // mutation to sync user data
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => console.log("User synced successfully:", response.data.user),
    onError: (error) => console.error("User sync failed:", error),
  });

  // auto-sync user when signed in
  useEffect(() => {
    // if user is signed in and user is not synced yet, sync user
    if (isSignedIn && !syncUserMutation.data) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn]);

  return null;
};