import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";
import { useCurrentUser } from "./useCurrentUser";


export const useProfile = () => {
    const api = useApiClient(); // Get the axios instance with authentication token

    const queryClient = useQueryClient(); // Access the query client to manage query cache
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State to control visibility of the edit profile modal

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        location: "",
    }); // State to hold form data for profile editing

    const { currentUser } = useCurrentUser(); // Fetch current user data using the custom hook

    const updateProfileMutation = useMutation({
        mutationFn: (profileData: any) => userApi.updateProfile(api, profileData), // Mutation function to update user profile
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Invalidate the authUser query to refetch updated user data
            setIsEditModalVisible(false); // Close the edit profile modal
            Alert.alert("Success", "Profile updated successfully"); // Show success alert
        },
        onError: (error: any) => {
            Alert.alert("Error", error.response?.data?.error || "Failed to update profile"); // Show error alert on failure
        },
    }); // Mutation to update user profile

    const openEditModal = () => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || "",
                lastName: currentUser.lastName || "",
                bio: currentUser.bio || "",
                location: currentUser.location || ""
            }); // Pre-fill form data with current user info
        }
        setIsEditModalVisible(true); // Open the edit profile modal
    }; // Function to open the edit profile modal

    const updateFormField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value })); // Update specific form field in the state
    }; // Function to update form field values

    return {
        isEditModalVisible,
        formData,
        openEditModal,
        closeEditModal: () => setIsEditModalVisible(false),
        saveProfile: () => updateProfileMutation.mutate(formData),
        updateFormField,
        isUpdating: updateProfileMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    }; // Return state and functions for use in components
};