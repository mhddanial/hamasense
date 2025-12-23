import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  avatar: string;
  role?: string;
}

interface Post {
  id: number;
  author: User;
  timestamp: string;
  category: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export function useCommunityPosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  // LIKE - Integrasi dengan Backend
  const handleLike = async (postId: number) => {
    // Optimistic update
    const originalPosts = [...posts];
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));

    try {
      const response = await axios.post(`/community/${postId}/like`);

      if (response.data.success) {
        // Update dengan data dari server (lebih akurat)
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: response.data.data.isLiked,
              likes: response.data.data.likeCount
            };
          }
          return post;
        }));
      }
    } catch (error: any) {
      // Rollback jika error
      setPosts(originalPosts);
      toast.error(error.response?.data?.message || 'Gagal memproses like');
    }
  };

  // BOOKMARK - Integrasi dengan Backend
  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));

    // TODO: Implement backend bookmark jika perlu
    // axios.post(`/community/${postId}/bookmark`);
  };

  const addPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const updatePost = (postId: number, updatedData: Partial<Post>) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, ...updatedData } : post
    ));
  };

  const deletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return {
    posts,
    handleLike,
    handleBookmark,
    addPost,
    updatePost,
    deletePost
  };
}