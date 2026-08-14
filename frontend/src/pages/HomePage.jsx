import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import PostCard from '../components/PostCard';
import { Search, Loader2 } from 'lucide-react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.getCategories();
        setCategories(res.categories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch posts when filters change
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (selectedCategory) params.append('category', selectedCategory);
        params.append('page', page);
        params.append('limit', '6');

        const res = await api.getPosts(params.toString());
        setPosts(res.posts);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadPosts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, page]);

  return (
    <div className="container">
      {/* Hero Header */}
      <section className="hero">
        <h1>Discover Insightful Stories & Ideas</h1>
        <p>A full-stack blogging platform built with React, Node.js, Express & MongoDB.</p>

        {/* Search & Category Filter Bar */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search articles by title, topic, or keywords..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="categories-pills">
            <button
              className={`pill-btn ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('');
                setPage(1);
              }}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`pill-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setPage(1);
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section>
        {loading ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 1rem' }} />
            <p>Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No articles found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or selecting a different category.</p>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '4rem' }}>
                <button
                  className="btn btn-sm btn-outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
