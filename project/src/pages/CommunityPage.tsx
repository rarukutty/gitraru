import { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Send, Bookmark } from 'lucide-react';
import Card from '../components/ui/Card';
import { samplePosts } from '../data/seed';

interface Post {
  id: string;
  author: string;
  avatar: string;
  destination: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  time: string;
}

interface CommentDraft {
  [postId: string]: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [commentDrafts, setCommentDrafts] = useState<CommentDraft>({});
  const [commentLists, setCommentLists] = useState<Record<string, string[]>>({});

  function toggleLike(id: string) {
    setLiked(s => {
      const next = new Set(s);
      if (next.has(id)) { next.delete(id); setPosts(p => p.map(x => x.id === id ? { ...x, likes: x.likes - 1 } : x)); }
      else { next.add(id); setPosts(p => p.map(x => x.id === id ? { ...x, likes: x.likes + 1 } : x)); }
      return next;
    });
  }

  function toggleComments(id: string) {
    setShowComments(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleSaved(id: string) {
    setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function submitComment(postId: string) {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    setCommentLists(c => ({ ...c, [postId]: [...(c[postId] || []), text] }));
    setCommentDrafts(d => ({ ...d, [postId]: '' }));
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Discover and share travel experiences</p>
      </div>

      {/* Create post prompt */}
      <Card className="p-4 mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm flex-shrink-0">
          ME
        </div>
        <button className="flex-1 text-left px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Share your travel story...
        </button>
      </Card>

      <div className="space-y-5">
        {posts.map(post => {
          const isLiked = liked.has(post.id);
          const isSaved = saved.has(post.id);
          const commentsOpen = showComments.has(post.id);
          const extraComments = commentLists[post.id] || [];

          return (
            <Card key={post.id} className="overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 pb-3">
                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{post.author}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{post.destination} · {post.time}
                  </p>
                </div>
                <button
                  onClick={() => toggleSaved(post.id)}
                  className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-700 dark:text-gray-300 px-4 pb-3 leading-relaxed">{post.content}</p>

              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.destination}
                  className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  {post.likes}
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {post.comments + extraComments.length}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-auto">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Comments section */}
              {commentsOpen && (
                <div className="px-4 py-3 space-y-3">
                  {extraComments.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-xs flex-shrink-0">
                        ME
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 flex-1">
                        <p className="text-xs text-gray-900 dark:text-white">{c}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-xs flex-shrink-0">
                      ME
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        placeholder="Write a comment..."
                        value={commentDrafts[post.id] || ''}
                        onChange={e => setCommentDrafts(d => ({ ...d, [post.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && submitComment(post.id)}
                        className="flex-1 px-3 py-1.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
