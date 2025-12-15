import React, { useState } from 'react';
import { Heart, MessageSquare, Bookmark, MoreHorizontal, Share2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"; // Opsional: jika ingin separator lebih tegas
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
  onProfileClick?: (userId: number) => void; // Tambahan: navigasi ke profil
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
  onShare,
  onProfileClick
}: PostCardProps) {
  
  // State untuk handle "Baca Selengkapnya"
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150; // Batas karakter sebelum di-truncate
  const shouldTruncate = post.content.length > MAX_LENGTH;

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const isOwnPost = currentUserId === post.author.id;

  return (
    <Card className="border border-border/60 shadow-sm transition-all hover:shadow-md overflow-hidden bg-card">
      
      {/* Post Header */}
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 group cursor-pointer" onClick={() => onProfileClick?.(post.author.id)}>
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold group-hover:underline decoration-primary decoration-2 underline-offset-2">
                    {post.author.name}
                </h3>
                {post.author.role && (
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-muted text-muted-foreground">
                    {post.author.role}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{post.timestamp}</span>
                <span className="text-border">•</span>
                <Badge variant="outline" className="text-xs h-4 px-1 border-primary/20 text-primary bg-primary/5">
                    {post.category}
                </Badge>
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
              <Button size="icon" variant="ghost" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="px-4 space-y-3">
        {/* Text Content with Read More Logic */}
        <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {isExpanded ? post.content : (
             shouldTruncate ? `${post.content.slice(0, MAX_LENGTH)}...` : post.content
          )}
          
          {shouldTruncate && (
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center"
            >
                {isExpanded ? "Sembunyikan" : "Selengkapnya"}
            </button>
          )}
        </div>

        {/* Post Image (Improved Layout) */}
        {post.image && (
          <div className="mt-3 overflow-hidden rounded-xl border bg-muted/30">
            <img
              src={post.image}
              alt="Post attachment"
              className="w-full h-auto max-h-[400px] object-cover hover:scale-[1.01] transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
      </CardContent>

      {/* Post Actions (Footer) */}
      <div className="px-4 py-3 border-t bg-muted/5 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Like Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onLike(post.id)}
              className={`h-8 gap-1.5 px-2 hover:bg-red-50 hover:text-red-600 transition-colors ${
                post.isLiked ? 'text-red-500 bg-red-50/50' : 'text-muted-foreground'
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-transform ${post.isLiked ? 'scale-110 fill-current' : ''}`}
              />
              <span className="text-xs font-medium">{formatNumber(post.likes)}</span>
              <span className="sr-only">Likes</span>
            </Button>

            {/* Comment Button */}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1.5 px-2 text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
              onClick={() => onComment?.(post.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">{formatNumber(post.comments)}</span>
              <span className="sr-only">Comments</span>
            </Button>

            {/* Share Button (New) */}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1.5 px-2 text-muted-foreground hover:bg-green-50 hover:text-green-600"
              onClick={() => onShare?.(post.id)}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Share</span>
            </Button>
          </div>

          {/* Bookmark Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onBookmark(post.id)}
            className={`h-8 w-8 transition-colors ${
              post.isBookmarked ? 'text-orange-500 bg-orange-50 hover:bg-orange-100' : 'text-muted-foreground hover:text-orange-500'
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`}
            />
          </Button>
        </div>
    </Card>
  );
}