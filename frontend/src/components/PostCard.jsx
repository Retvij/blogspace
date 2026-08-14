import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';

const PostCard = ({ post }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="post-card">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="post-card-image"
          loading="lazy"
        />
      </Link>

      <div className="post-card-body">
        {post.category && (
          <span className="category-badge">{post.category.name}</span>
        )}

        <h3 className="post-card-title">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="post-card-excerpt">{post.excerpt}</p>

        <div className="post-card-footer">
          <div className="author-info">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={post.author?.name || 'Author'}
              className="author-avatar"
            />
            <span>{post.author?.name || 'Anonymous'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> {post.readTime || 3} min
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} /> {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
