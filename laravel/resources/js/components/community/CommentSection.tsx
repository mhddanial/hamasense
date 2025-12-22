import { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Reply, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Comment {
  id: number;
  content: string;
  user: {
    name: string;
    avatar: string;
  };
  created_at: string;
  replies: Comment[];
}

interface CommentSectionProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Component untuk render individual comment (recursive)
const CommentItem = ({
  comment,
  postId,
  replyTo,
  setReplyTo,
  replyContent,
  setReplyContent,
  handleSubmitReply,
  isLoading,
  level = 0
}: {
  comment: Comment;
  postId: number;
  replyTo: number | null;
  setReplyTo: (id: number | null) => void;
  replyContent: string;
  setReplyContent: (content: string) => void;
  handleSubmitReply: (parentId: number) => void;
  isLoading: boolean;
  level?: number;
}) => {
  const maxLevel = 5;
  const isTopLevel = level === 0;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Avatar className={isTopLevel ? "h-8 w-8 flex-shrink-0" : "h-6 w-6 flex-shrink-0"}>
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className={`${isTopLevel ? 'bg-muted' : 'bg-muted/60'} rounded-lg p-3`}>
            <p className={`font-semibold ${isTopLevel ? 'text-sm' : 'text-xs'}`}>
              {comment.user.name}
            </p>
            <p className={`${isTopLevel ? 'text-sm' : 'text-xs'} mt-1 whitespace-pre-wrap break-words`}>
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground px-1">
            <span>{comment.created_at}</span>

            {level < maxLevel && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs hover:text-primary transition-colors"
                onClick={() => setReplyTo(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Balas
              </Button>
            )}
          </div>

          {replyTo === comment.id && (
            <div className="mt-2 flex gap-2">
              <Textarea
                placeholder={`Balas ${comment.user.name}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px] text-sm"
                autoFocus
              />
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={isLoading || !replyContent.trim()}
                  className="h-8"
                >
                  <Send className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyTo(null)}
                  className="h-8"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 mt-3 space-y-3 border-l-2 border-muted pl-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  replyTo={replyTo}
                  setReplyTo={setReplyTo}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  handleSubmitReply={handleSubmitReply}
                  isLoading={isLoading}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main CommentSection Component
export default function CommentSection({ postId, isOpen, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen]);

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`/community/${postId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Gagal memuat komentar');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`/community/${postId}/comments`, {
        content: newComment,
        parent_id: null
      });

      if (response.data.success) {
        setNewComment('');
        loadComments();
        toast.success('Komentar berhasil ditambahkan!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan komentar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`/community/${postId}/comments`, {
        content: replyContent,
        parent_id: parentId
      });

      if (response.data.success) {
        setReplyContent('');
        setReplyTo(null);
        loadComments();
        toast.success('Balasan berhasil ditambahkan!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan balasan');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between bg-background">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Komentar ({comments.length})
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingComments ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-3">Memuat komentar...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">Belum ada komentar</p>
              <p className="text-xs text-muted-foreground mt-1">
                Jadilah yang pertama berkomentar di postingan ini!
              </p>
            </div>
          ) : (
            comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                handleSubmitReply={handleSubmitReply}
                isLoading={isLoading}
                level={0}
              />
            ))
          )}
        </div>

        <div className="p-4 border-t bg-muted/20">
          <div className="flex gap-2">
            <Textarea
              placeholder="Tulis komentar Anda..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={isLoading || !newComment.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tekan <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> untuk kirim,
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs ml-1">Shift+Enter</kbd> untuk baris baru
          </p>
        </div>
      </Card>
    </div>
  );
}