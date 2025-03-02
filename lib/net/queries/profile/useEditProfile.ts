import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildUserByIdQueryKey } from "./useGetUserById";
import { UserProfile } from "@/lib/types";
import { useProfileStore } from "@/lib/store/profileStore";

export interface EditProfileParams {
  email?: string;
  username?: string;
  bio?: string;
  badges?: string[];
  title?: string;
  image?: string;
  coverImage?: string;
  publicSocialLinks?: {
    platform: string;
    url: string;
  }[];
}

function useEditProfile() {
  const queryClient = useQueryClient();
  const profile = useProfileStore((state) => state.profile);
  const id = profile?.id ? String(profile.id) : "";
  
  return useMutation({
    mutationFn: async (params: EditProfileParams) => {
      return client.patch(`/users/id/${id}`, params);
    },
    onMutate: async (params: EditProfileParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [buildUserByIdQueryKey(id)] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(buildUserByIdQueryKey(id)) as UserProfile;
      
      // Create an optimistic update by merging params into the existing user profile
      const updatedProfile: UserProfile = {
        ...previousData,
        username: params.username ?? previousData.username,
        profileDetails: {
          ...previousData.profileDetails,
          bio: params.bio ?? previousData.profileDetails.bio,
          badges: params.badges ?? previousData.profileDetails.badges,
          title: params.title ?? previousData.profileDetails.title,
          image: params.image ?? previousData.profileDetails.image,
          coverImage: params.coverImage ?? previousData.profileDetails.coverImage,
          socialLinks: params.publicSocialLinks ?? previousData.profileDetails.socialLinks,
        },
      };

      // Optimistically update the cache with the new data
      queryClient.setQueryData(buildUserByIdQueryKey(id), updatedProfile);
      
      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (error, variables, context: any) => {
      // Rollback to the previous value on error
      if (context?.previousData) {
        queryClient.setQueryData(buildUserByIdQueryKey(id), context.previousData);
      }

      console.error("An error occurred while editing the profile:", error);
      throw error;
    },
    onSuccess: () => {
      // Since the user profile updation doesn't return any ids, we don't need to invalidate any queries
      // We can keep the manually updated cache as it is
      
      // queryClient.invalidateQueries({ queryKey: [buildUserByIdQueryKey(id)] });
    },
  });
}

export default useEditProfile;
