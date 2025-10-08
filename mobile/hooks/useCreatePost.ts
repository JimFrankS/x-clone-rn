import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useApiClient } from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";

export const useCreatePost = () => {
  const [content, setContent] = useState(""); // State for text content
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // state for image content
  const api = useApiClient(); // get authenticated Api Instance
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({ // This will send a request to our API
    mutationFn: async (postData: { content: string; imageUri?: string }) => {
      const formData = new FormData();

      if (postData.content) formData.append("content", postData.content);

      if (postData.imageUri) {
        const uriParts = postData.imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1].toLowerCase();

        const mimeTypeMap: Record<string, string> = {
          png: "image/png",
          gif: "image/gif",
          webp: "image/webp",
        };
        const mimeType = mimeTypeMap[fileType] || "image/jpeg";

        // Read image as base64
        const base64 = await FileSystem.readAsStringAsync(postData.imageUri, { encoding: FileSystem.EncodingType.Base64 });
        formData.append("image", base64);
        formData.append("imageType", mimeType);
      }

      const token = await getToken();
      const url = `${api.defaults.baseURL}/api/posts`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      return response.json();
    },
    onSuccess: () => {
      setContent("");
      setSelectedImage(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Alert.alert("Success", "Post created successfully!");
    },
    onError: (error) => {
      console.log("Create post error:", error);
      const errorMessage = (error as any)?.response?.data?.error || "Failed to create post. Please try again.";
      Alert.alert("Error", errorMessage);
    },
  });

  const handleImagePicker = async (useCamera: boolean = false) => { // Handles image selection from gallery or camera
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync() // Request Camera Permision
      : await ImagePicker.requestMediaLibraryPermissionsAsync(); // or gallery permision

    if (permissionResult.status !== "granted") { // If permission is not granted, show an alert
      const source = useCamera ? "camera" : "photo library";
      Alert.alert("Permission needed", `Please grant permission to access your ${source}`);
      return;
    }

    const pickerOptions = {
      allowsEditing: true,
      aspect: [16, 9] as [number, number],
      quality: 0.8,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync({
          ...pickerOptions,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const createPost = () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert("Empty Post", "Please write something or add an image before posting!");
      return;
    }

    const postData: { content: string; imageUri?: string } = {
      content: content.trim(),
    };

    if (selectedImage) postData.imageUri = selectedImage;

    createPostMutation.mutate(postData);
  };

  return {
    content,
    setContent,
    selectedImage,
    isCreating: createPostMutation.isPending,
    pickImageFromGallery: () => handleImagePicker(false),
    takePhoto: () => handleImagePicker(true),
    removeImage: () => setSelectedImage(null),
    createPost,
  };
};