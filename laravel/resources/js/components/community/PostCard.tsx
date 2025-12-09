import React from 'react';
import { Heart, MessageSquare, Bookmark, Flag, MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostActionMenu from './PostActionMenu';

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

interface PostCardProps {
  post: Post;
  currentUserId?: number;
  onLike: (postId: number) => void;
  onBookmark: (postId: number) => void;
  onComment?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onReport?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

export default function PostCard({
  post,
  currentUserId,
  onLike,
  onBookmark,
  onComment,
  onEdit,
  onDelete,
  onReport,
  onShare
}: PostCardProps) {
    console.log('PostCard - post.image:', post.image);
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const isOwnPost = currentUserId === post.author.id;

  return (
    <Card className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden">
      {/* Post Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{post.author.name}</h3>
                {post.author.role && (
                  <Badge variant="secondary" className="text-xs">
                    {post.author.role}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{post.timestamp}</span>
                <span>•</span>
                <span className="text-primary">{post.category}</span>
              </div>
            </div>
          </div>

          <PostActionMenu
            postId={post.id}
            isOwnPost={isOwnPost}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
            onReport={onReport}
            trigger={
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="space-y-3 pb-3">
        <p className="text-sm leading-relaxed text-foreground/90">
          {post.content}
        </p>

        {/* Post Image */}
        {post.image && (
          <div className="overflow-hidden rounded-lg">
            <img
              src={post.image}
              alt="Post image"
              className="w-full object-cover max-h-80"
            />
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-sidebar-border/50">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onLike(post.id)}
              className={`gap-2 ${
                post.isLiked ? 'text-red-500 hover:text-red-600' : ''
              }`}
            >
              <Heart
                className="h-4 w-4"
                fill={post.isLiked ? 'currentColor' : 'none'}
              />
              <span className="text-xs font-medium">{formatNumber(post.likes)}</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="gap-2"
              onClick={() => onComment?.(post.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">{post.comments}</span>
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onBookmark(post.id)}
              className={`h-8 w-8 ${
                post.isBookmarked ? 'text-primary' : ''
              }`}
            >
              <Bookmark
                className="h-4 w-4"
                fill={post.isBookmarked ? 'currentColor' : 'none'}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}