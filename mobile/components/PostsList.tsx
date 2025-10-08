import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/types';
import PostCard from './PostCard';
import CommentModal from './CommentModal';


const PostsList = () => {
   const {currentUser} = useCurrentUser(); // Ensure current user data is fetched and available
    const { posts, isLoading, error, refetch, toggleLike, deletePost, checkIsLiked } = usePosts();

    const [selectedPostId, setSelectedPostId] = useState <string | null>(null); // State to track the selected post for detailed view

    const selectedPost = selectedPostId? posts.find((p: Post) => p._id === selectedPostId) : null;

    if (isLoading) {
        return (
            <View className='p-8 items-center'>
                <ActivityIndicator size="large" color="#1DA1F2" />
                <Text className='text-gray-500 mt-2'>Loading Posts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className='p-8 items-center'>
                <Text className='text-gray-500 mb-4' > Failed to load posts {error.message} </Text>
                <TouchableOpacity className='bg-blue-500 px-4 py-2 rounded-lg' onPress={() => refetch()}>
                   <Text className='text-white font-semibold'>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (posts.length === 0) {
        return (
            <View className='p-8 items-center'>
                <Text className='text-gray-500'>No Posts yet</Text>
            </View>
        )
    }
 
  return (
    <>
    {posts.map ((post: Post) => (
        <PostCard
        key={post._id}
        post={post}
        currentUser={currentUser}
        onLike={toggleLike}
        onDelete={deletePost}
        onComment={(post: Post) => setSelectedPostId(post._id)}
        isLiked={checkIsLiked(post.likes, currentUser)}
        /> 
    ))}

    <CommentModal selectedPost = {selectedPost} onClose={() => setSelectedPostId(null)} /> {/* Comment modal for detailed post view */}
    </>
  )
}

export default PostsList