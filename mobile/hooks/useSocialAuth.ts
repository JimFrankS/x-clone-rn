import { useSSO } from "@clerk/clerk-expo"; // Import useSSO from Clerk Expo for purposes of social auth flows
import { useState } from "react"; // Import useState from React for managing loading state
import { Alert } from "react-native"; // Import Alert from React Native for displaying error messages

export const useSocialAuth = () => { // Create and export useSocialAuth hook
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator
  const { startSSOFlow } = useSSO(); // Destructure startSSOFlow from useSSO for initiating social auth flows

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => { 
    setIsLoading(true); // Set loading state to true when authentication starts
    try { 
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } // If a session was created, set it as the active session
    } catch (err) { 
      console.log("Error in social auth", err);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSocialAuth };
};