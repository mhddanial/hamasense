import { useState } from 'react';

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

  const handleLike = (postId: number) => {
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
  };

  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
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