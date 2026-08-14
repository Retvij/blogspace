import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';

const CreateEditPostPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        setCategories(res.categories);
        if (res.categories.length > 0 && !category) {
          setCategory(res.categories[0]._id);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // If editing, load existing post data
  useEffect(() => {
    if (isEditing) {
      const fetchPostData = async () => {
        try {
          const res = await api.getPost(id);
          const p = res.post;
          setTitle(p.title);
          setCategory(p.category?._id || p.category);
          setCoverImage(p.coverImage || '');
          setExcerpt(p.excerpt || '');
          setContent(p.content);
          setTags(p.tags ? p.tags.join(', ') : '');
        } catch (err) {
          setError(err.message || 'Failed to load article');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchPostData();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      setError('Please provide title, category, and content.');
      return;
    }

    setLoading(true);
    setError('');

    const postData = {
      title,
      category,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      excerpt: excerpt.trim(),
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        const res = await api.updatePost(id, postData);
        navigate(`/post/${res.post.slug}`);
      } else {
        const res = await api.createPost(postData);
        navigate(`/post/${res.post.slug}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save article.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 1rem' }} />
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '850px', padding: '2.5rem 0 5rem' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
          {isEditing ? 'Edit Article' : 'Write a New Article'}
        </h1>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Article Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter an engaging, descriptive title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category *</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="JavaScript, React, FullStack"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cover Image URL (Optional)</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/photo-..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Short Summary / Excerpt (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="A brief 1-2 sentence overview shown on post cards..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Article Content (Markdown / Text) *</label>
            <textarea
              className="form-control"
              placeholder="Write your article content here. You can use Markdown headers (## Heading 2, ### Heading 3) and paragraphs..."
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <Link to="/dashboard" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditPostPage;
