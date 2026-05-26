import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(), 400);
    return () => clearTimeout(timer);
  }, [category, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await api.get(`/posts?${params}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Other'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome to Blog Platform</h1>
        <p>Share your thoughts and connect with readers</p>
      </div>
      
      <div style={styles.filters}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      {loading ? (
        <div style={styles.loading}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div style={styles.noPosts}>No posts found. Be the first to create one!</div>
      ) : (
        <div style={styles.postsGrid}>
          {posts.map(post => (
            <div key={post._id} style={styles.postCard}>
              <img src={post.imageUrl} alt={post.title} style={styles.postImage} />
              <div style={styles.postContent}>
                <span style={styles.category}>{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <div style={styles.postMeta}>
                  <span>By {post.author?.name}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>👁️ {post.views} views</span>
                </div>
                <Link to={`/post/${post._id}`} style={styles.readMore}>Read More →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center',
  },
  select: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  searchInput: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '250px',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  },
  postCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
    transition: 'transform 0.3s',
  },
  postImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  postContent: {
    padding: '1rem',
  },
  category: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.75rem',
    marginBottom: '0.5rem',
  },
  readMore: {
    display: 'inline-block',
    marginTop: '1rem',
    color: '#3498db',
    textDecoration: 'none',
  },
  postMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  loading: {
    textAlign: 'center',
    marginTop: '3rem',
  },
  noPosts: {
    textAlign: 'center',
    marginTop: '3rem',
    fontSize: '1.2rem',
    color: '#666',
  },
};

export default Home;