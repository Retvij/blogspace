import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PenSquare, Edit3, Trash2, Eye, Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMyPosts = async () => {
    try {
      const res = await api.getMyPosts();
      setPosts(res.posts);
    } catch (err) {
      console.error('Failed to load user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.deletePost(id);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0 5rem' }}>
      {/* Header with Profile summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={user?.avatar}
            alt={user?.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
          />
          <div>
            <h1 style={{ fontSize: '1.8rem' }}>Welcome, {user?.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{user?.email} • {user?.bio}</p>
          </div>
        </div>

        <Link to="/create-post" className="btn btn-primary">
          <PenSquare size={18} /> Write New Article
        </Link>
      </div>

      {/* Posts Table Section */}
      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>My Published Articles ({posts.length})</h2>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
            <p>Loading your articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't written any articles yet.</p>
            <Link to="/create-post" className="btn btn-primary btn-sm">
              <PenSquare size={16} /> Write your first post
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th>Estimated Read</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>
                      <Link to={`/post/${post.slug}`} style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                        {post.title}
                      </Link>
                    </td>
                    <td>
                      <span className="category-badge">{post.category?.name || 'General'}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{post.readTime} min</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link to={`/post/${post.slug}`} className="btn btn-sm btn-outline" title="View Article">
                          <Eye size={15} />
                        </Link>
                        <Link to={`/edit-post/${post._id}`} className="btn btn-sm btn-outline" title="Edit Article">
                          <Edit3 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="btn btn-sm btn-danger"
                          title="Delete Article"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
