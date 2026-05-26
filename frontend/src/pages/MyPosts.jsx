import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await api.get('/posts/my');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Delete this post?')) {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>My Posts</h1>
      {posts.length === 0 ? (
        <div style={styles.noPosts}>
          <p>You haven't written any posts yet.</p>
          <Link to="/create-post" style={styles.createButton}>Create Your First Post</Link>
        </div>
      ) : (
        <div style={styles.postsList}>
          {posts.map(post => (
            <div key={post._id} style={styles.postCard}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div style={styles.postMeta}>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>👁️ {post.views} views</span>
              </div>
              <div style={styles.actions}>
                <Link to={`/post/${post._id}`} style={styles.viewButton}>View</Link>
                <Link to={`/edit-post/${post._id}`} style={styles.editButton}>Edit</Link>
                <button onClick={() => handleDelete(post._id)} style={styles.deleteButton}>Delete</button>
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
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  postCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: 'white',
  },
  postMeta: {
    display: 'flex',
    gap: '1rem',
    color: '#666',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  viewButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f39c12',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    marginTop: '3rem',
  },
  noPosts: {
    textAlign: 'center',
    marginTop: '3rem',
  },
  createButton: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
};

export default MyPosts;