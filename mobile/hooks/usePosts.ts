import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, postApi } from "@/utils/api";

export const usePosts = (username?: string) => { // Custom hook to manage posts data and actions
    const api = useApiClient(); // Axios instance with auth token
    const queryClient = useQueryClient(); // To invalidate and refetch queries after mutations

    const { // Renamed to postsData to avoid conflict with posts array below
        data: postsData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: username ? ["userPosts", username] : ["posts"], // if username is provided, fetch user-specific posts
        queryFn: () => (username ? postApi.getUserPosts(api, username) : postApi.getPosts(api)), // API call to fetch posts based on presence of username
        select: (response) => response.data.posts // Assuming the API response structure has posts in response.data.posts
        // To check if the .data. should be there
    });

    const likePostMutation = useMutation({ // Mutation to like a post
        mutationFn: (postId: string) => postApi.likePost(api, postId), // API call to like a post
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] }) // Refetch posts after liking
            if (username) {
                queryClient.invalidateQueries({ queryKey: ["userPosts", username] }); // Invalidate userPosts if username is provided
            }
        },
    });

    const deletePostMutation = useMutation({ // Mutation to delete a post
        mutationFn: (postId: string) => postApi.deletePost(api, postId), // API call to delete a post
        onSuccess: () => { // Invalidate both posts and userPosts queries to ensure UI consistency
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            if (username) {
                queryClient.invalidateQueries({ queryKey: ["userPosts", username] }); // Invalidate userPosts if username is provided
            }
        },
    });

    const checkIsLiked = (postLikes: string[], currentUser: any) => { // Function to check if the current user has liked a post
        const isLiked = currentUser && postLikes.includes(currentUser._id);
        return isLiked;
    };

    return { // Return posts data and actions
        posts: postsData || [],
        isLoading,
        error,
        refetch,
        toggleLike: (postId: string) => likePostMutation.mutate(postId),
        deletePost: (postId: string) => deletePostMutation.mutate(postId),
        checkIsLiked,
    };

};