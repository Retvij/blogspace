import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import { ArrowLeft, Clock, Calendar, Edit3, Trash2, Loader2 } from 'lucide-react';

const PostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.getPost(slug);
        setPost(res.post);
      } catch (err) {
        setError(err.message || 'Article not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await api.deletePost(post._id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto 1rem' }} />
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>{error || "The article you're looking for does not exist."}</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  const isAuthor = user && (user.id === post.author?._id || user.role === 'admin');

  return (
    <div className="container">
      <article className="post-detail">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to all articles
        </Link>

        {post.category && (
          <div>
            <span className="category-badge">{post.category.name}</span>
          </div>
        )}

        <h1 style={{ fontSize: '2.4rem', letterSpacing: '-0.02em', margin: '0.5rem 0 1rem' }}>{post.title}</h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
          <div className="author-info">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={post.author?.name}
              className="author-avatar"
              style={{ width: '40px', height: '40px' }}
            />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{post.author?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.author?.bio}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={15} /> {post.readTime} min read
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={15} /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Action Controls for Author */}
        {isAuthor && (
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
            <Link to={`/edit-post/${post._id}`} className="btn btn-sm btn-outline">
              <Edit3 size={15} /> Edit Article
            </Link>
            <button onClick={handleDelete} className="btn btn-sm btn-danger">
              <Trash2 size={15} /> Delete Article
            </button>
          </div>
        )}

        {/* Cover Image */}
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="post-detail-cover" />
        )}

        {/* Article Body */}
        <div className="post-detail-content">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('## ')) {
              return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <CommentSection postId={post._id} />
      </article>
    </div>
  );
};

export default PostDetailPage;
