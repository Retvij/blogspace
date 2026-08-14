import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Trash2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchComments = async () => {
    try {
      const res = await api.getComments(postId);
      setComments(res.comments);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await api.createComment({ postId, content });
      setComments([res.comment, ...comments]);
      setContent('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.deleteComment(id);
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <MessageSquare size={20} /> Comments ({comments.length})
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Write a constructive comment..."
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            <Send size={15} /> {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div style={{ background: 'var(--bg-page)', padding: '1rem 1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Please <Link to="/login" style={{ fontWeight: '600' }}>Login</Link> or <Link to="/register" style={{ fontWeight: '600' }}>Sign Up</Link> to leave a comment.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No comments yet. Be the first to start the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                background: 'var(--bg-page)',
                padding: '1.2rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img
                    src={comment.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={comment.author?.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{comment.author?.name || 'Anonymous'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    • {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {user && (user.id === comment.author?._id || user.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    title="Delete Comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p style={{ color: '#334155', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
