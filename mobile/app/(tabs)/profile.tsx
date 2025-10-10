import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import SignOutButton from '@/components/SignOutButton'
import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { usePosts } from '@/hooks/usePosts'
import PostsList from '@/components/PostsList'

const ProfileScreen = () => {
  const { currentUser, isLoading } = useCurrentUser();
  const insets = useSafeAreaInsets();
  const { user } = useUser();


  const { posts: userPosts, refetch: refetchPosts, isLoading: isRefetching } = usePosts(currentUser?.username); // Fetch posts for the current user using their username


  if (isLoading) {
    return (
      <View className='flex-1 bg-white items-center justify-center'>
        <ActivityIndicator size='large' color='#1DA1F2' />
      </View>
    )
  }
  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <View>
          <Text className='text-xl font-bold text-gray-900'>
            {currentUser.firstName} {currentUser.lastName}
          </Text>
          <Text className='text-gray-500 text-sm'> {userPosts.length} Posts</Text>
        </View>
        <SignOutButton />
      </View>

      {/* Profile Info */}
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}

      >
        {/* Banner Image */}
        <Image
          source={{
            uri:

              currentUser.bannerImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className='w-full h-48'
          resizeMode='cover'
        />


        {/* Profile Picture, slightly insert in the banner image */}
        <View className='px-4 pb-4 border-b border-gray-100'>
          <View className='flex-row justify-between items-end -mt-16 mb-4'>
            <Image
              source={{ uri: user?.imageUrl }}
              className='w-32 h-32 rounded-full border-4 border-white' />


            {/* Edit Profile Button */}

            <TouchableOpacity className='border border-gray-300 px-6 py-2 rounded-full'
            >
              <Text className='font-semibold text-gray-900'>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          {/* User Info */}
          <View className='mb-4'>
            <View className='flex-row items-center mb-1'>
              <Text className='text-xl font-bold text-gray-900 mr-2'>{currentUser.firstName} {currentUser.lastName}</Text>
              <Feather name='check-circle' size={18} color='#1DA1F2' />
            </View>

            <Text className='text-gray-500 mb-1'>@{currentUser.username}</Text>
            <Text className='text-gray-900'>{currentUser.bio || "My Bio, still in progress!"}</Text>


            <View className='flex-row items-center mb-2'>
              <Feather name='map-pin' size={16} color='657786' />
              <Text className='text-gray-500 ml-2'>{currentUser.location || "Unknown"}</Text>
            </View>

            <View className='flex-row items-center mb-3'>
              <Feather name='calendar' size={16} color={"#657786"} />
              <Text className='text-gray-500 ml-2'>Joined {format(new Date(currentUser.createdAt), 'dd MMMM yyyy')}</Text>
            </View>

            <View className='flex-row'>
              <TouchableOpacity className='mr-6 '>
                <Text className='text-gray-900'>
                  <Text className='font-bold'>{currentUser.following?.length}</Text>
                  <Text className='text-gray-500'> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className='text-gray-900'>
                  <Text className='font-bold'>{currentUser.followers?.length}</Text>
                  <Text className='text-gray-500'> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Posts List */}
        <PostsList username={currentUser?.username} />
      </ScrollView>

    </SafeAreaView>
  )
}

export default ProfileScreen