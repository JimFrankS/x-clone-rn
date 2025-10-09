import { View, Text, TouchableOpacity, Modal, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native';
import React from 'react';
import { Post } from '@/types';
import { useComments } from '@/hooks/useComments';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface CommentModalProps {
    selectedPost: Post | null;
    onClose: () => void;
}

const CommentModal = ({ selectedPost, onClose }: CommentModalProps) => {

    const { commentText, setCommentText, createComment, isCreatingComment } = useComments();
    const { currentUser } = useCurrentUser();

    const handleClose = () => {
        onClose();
        setCommentText("");
    }

    return (
        <Modal visible={!!selectedPost} animationType="slide" presentationStyle="pageSheet">
            <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100 '>
                <TouchableOpacity onPress={handleClose}>
                    <Text className='text-blue-500 text-lg font-semibold'>Close</Text>
                </TouchableOpacity>

                <Text className='text-lg font-semibold'>Comments </Text>
                <View className='w-12' /> {/* Placeholder for alignment */}
            </View> {/* Modal header with close button */}

            {selectedPost && (
                <ScrollView className='flex-1'>
                    {/* Original Post */}
                    <View className='border-b border-gray-100 bg-white p-4'>
                        <View className='flex-row'>
                            <Image
                                source={{ uri: selectedPost.user.profilePicture }}
                                className='size-12 rounded-full mr-3' />

                            <View className='flex-1'>
                                <View className='flex-row items-center mb-1'>
                                    <Text className='font-bold text-gray-900 mr-1'>
                                        {selectedPost.user.firstName} {selectedPost.user.lastName}
                                    </Text>
                                    <Text className='text-gray-500 ml-1'>
                                        @{selectedPost.user.username} · {new Date(selectedPost.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>

                                {selectedPost.content && (
                                    <Text className='text-gray-900 text-base leading-5 mb-3'>
                                        {selectedPost.content}
                                    </Text>
                                )}
                                {selectedPost.image && (
                                    <Image
                                        source={{ uri: selectedPost.image }}
                                        className='w-full h-48 rounded-2xl mb-3'
                                        resizeMode='cover'
                                    />
                                )}
                            </View>
                        </View>
                    </View>

                    {/*  Comments Section */}

                    {selectedPost.comments.map((comment) => (
                        <View className='flex-row p-4'>
                            <Image
                                source={{ uri: comment.user.profilePicture }}
                                className='size-12 rounded-full mr-3' />

                            <View className='flex-1'>
                                <View className='flex-row items-center mb-1' >
                                    <Text className='font-bold text-gray-900 mr-1'>
                                        {comment.user.firstName} {comment.user.lastName}
                                    </Text>
                                    <Text className='text-gray-500 text-sm ml-1'> @{comment.user.username}</Text>
                                </View>

                                <Text className='text-gray-900 text-base leading-5 mb-2'>
                                    {comment.content}
                                </Text>
                            </View>
                        </View>
                    ))}

                    {/* Add Comment Section */}

                    <View className='p-4 border-t border-gray-100'>
                        <View className='flex-row'>
                            <Image
                                source={{ uri: currentUser?.profilePicture }}
                                className='size-12 rounded-full mr-3'
                            />

                            <View className='flex-1'>
                                <TextInput
                                    className='border border-gray-200 rounded-lg p-3 text-base mb-3'
                                    placeholder='Write a comment..'
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical='top'
                                />

                                {/* Comment Submision button */}

                                <TouchableOpacity className={`px-4 py-2 rounded-lg self-start ${commentText.trim() ? "bg-blue-500" : "bg-gray-300"}`}
                                
                                onPress={() => createComment(selectedPost._id)}
                                disabled={isCreatingComment || !commentText.trim()}
                                >
                                    {isCreatingComment ? (
                                        <ActivityIndicator size={"small"} color={"white"}/>
                                    ) : (
                                        <Text className={`font-semibold ${commentText.trim() ? "text-white" : "text-gray-500"}`}> Reply...</Text>
                                    )}
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                </ScrollView>
            )}
        </Modal>
    )
}

export default CommentModal