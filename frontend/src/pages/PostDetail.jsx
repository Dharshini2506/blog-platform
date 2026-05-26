import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    try {
      const response = await api.post('/comments', {
        content: newComment,
        postId: id,
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Delete this post? This action cannot be undone.')) {
      await api.delete(`/posts/${id}`);
      navigate('/');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!post) return <div style={styles.loading}>Post not found</div>;

  return (
    <div style={styles.container}>
      <article>
        <img src={post.imageUrl} alt={post.title} style={styles.image} />
        <h1>{post.title}</h1>
        <div style={styles.meta}>
          <span>By {post.author?.name}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>👁️ {post.views} views</span>
          <span>📁 {post.category}</span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div style={styles.tags}>
            {post.tags.map(tag => (
              <span key={tag} style={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
        <div style={styles.content}>{post.content}</div>
        
        {user && user._id === post.author?._id && (
          <div style={styles.actions}>
            <button onClick={() => navigate(`/edit-post/${id}`)} style={styles.editButton}>
              Edit Post
            </button>
            <button onClick={handleDeletePost} style={styles.deleteButton}>
              Delete Post
            </button>
          </div>
        )}
      </article>
      
      <div style={styles.commentsSection}>
        <h2>Comments ({comments.length})</h2>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              style={styles.commentInput}
              rows="3"
            />
            <button type="submit" style={styles.submitButton}>Post Comment</button>
          </form>
        ) : (
          <p style={styles.loginPrompt}>Please login to leave a comment</p>
        )}
        
        <div style={styles.commentsList}>
          {comments.map(comment => (
            <div key={comment._id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <strong>{comment.author?.name}</strong>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                {user && user._id === comment.author?._id && (
                  <button onClick={() => handleDeleteComment(comment._id)} style={styles.deleteCommentBtn}>
                    Delete
                  </button>
                )}
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    color: '#666',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  tags: {
    marginBottom: '1rem',
  },
  tag: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    marginRight: '0.5rem',
    fontSize: '0.85rem',
  },
  content: {
    lineHeight: '1.8',
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  commentsSection: {
    marginTop: '3rem',
    borderTop: '1px solid #ddd',
    paddingTop: '2rem',
  },
  commentForm: {
    marginBottom: '2rem',
  },
  commentInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    fontFamily: 'inherit',
  },
  submitButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  comment: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
  },
  commentHeader: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  deleteCommentBtn: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
  loading: {
    textAlign: 'center',
    marginTop: '3rem',
  },
  loginPrompt: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
};

export default PostDetail;