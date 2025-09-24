import { useSocialAuth } from "@/hooks/useSocialAuth";
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
export default function Index() {
const { handleSocialAuth, isLoading } = useSocialAuth(); // Destructure handleSocialAuth and isLoading from useSocialAuth hook
  return (
   <View className="flex-1 bg-white">
    <View className="flex-1 px-8 justify-between">
      <View className="flex-1 justify-center">
      
      {/* Demo image */} 
      <View className="items-center"> {/* Start of authentication image */}
          <Image
            source={require("../../assets/images/auth2.png")}
            style={{ width: 384, height: 384 }}
            resizeMode="contain"
          />
        </View> {/* End of authentication image */}
        <View className="flex-col gap-2">
          <TouchableOpacity // Start of Google Sign-In Button
          className="flex-row items-center justify-center bg-white border-gray-300 rounded-full py-3 px-6"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
          style ={{ // Add shadow box for iOS and elevation for Android
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
           }}
          >
            {isLoading ? ( // Show loading indicator if isLoading is true
              <ActivityIndicator size="small" color="#4285F4" />
            ) : (
              <View className="flex-row items-center justify-center"> {/* Start of Google logo and text */}
              <Image // Google logo
                source={require("../../assets/images/google.png")}
                style={{ width: 40, height: 40, marginRight: 12 }}
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Sign in with Google
              </Text>
              {/* End of Google logo and text */}
            </View> 
            )}
            
          </TouchableOpacity>  {/* End of Google Sign-In Button  */}

          <TouchableOpacity // Start of Apple Sign-In Button
          className="flex-row items-center justify-center bg-white border-gray-300 rounded-full py-3 px-6"
             onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
          style ={{ // Add shadow box for iOS and elevation for Android
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
           }}
          > 
            {isLoading ? ( // Show loading indicator if isLoading is true
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <View className="flex-row items-center justify-center"> {/* Start of Apple logo and text */}
              <Image // Apple logo
                source={require("../../assets/images/apple.png")}
                style={{ width: 32, height: 32, marginRight: 12 }}
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Sign in with Apple
              </Text>
              {/* End of Apple logo and text */}
            </View> 
            ) }
            
          </TouchableOpacity> {/* End of Apple Sign-In Button  */}
        </View>

        {/* Terms and privacy */}
        <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
            By signing up, you agree to our <Text className="text-blue-500">Terms</Text>
            {", "}
            <Text className="text-blue-500">Privacy Policy</Text>
            {", and "}
            <Text className="text-blue-500">Cookie Use</Text>.
          </Text>
      </View>
    </View>
      
    </View> 
  );
}
