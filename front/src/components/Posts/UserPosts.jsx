import React from 'react';
import useDataStore from '../../store/dataStore';
import './UserPosts.css';

const UserPosts = ({ userId }) => {
  const posts = useDataStore((state) => state.getPostsByUserId(userId));
  
  if (!posts || posts.length === 0) {
    return (
      <div className="no-posts">
        <p>No posts available for this user.</p>
      </div>
    );
  }
  
  return (
    <div className="user-posts">
      <h3 className="posts-title">Posts ({posts.length})</h3>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h4 className="post-title">{post.title}</h4>
            <p className="post-body">{post.body}</p>
            <div className="post-id">Post ID: {post.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPosts;