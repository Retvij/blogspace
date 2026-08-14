const BASE_URL = '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the request');
  }

  return data;
};

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Posts
  getPosts: (params = '') => request(`/posts${params ? `?${params}` : ''}`),
  getPost: (slugOrId) => request(`/posts/${slugOrId}`),
  createPost: (postData) => request('/posts', { method: 'POST', body: JSON.stringify(postData) }),
  updatePost: (id, postData) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(postData) }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  getMyPosts: () => request('/posts/user/my-posts'),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (catData) => request('/categories', { method: 'POST', body: JSON.stringify(catData) }),

  // Comments
  getComments: (postId) => request(`/comments/post/${postId}`),
  createComment: (commentData) => request('/comments', { method: 'POST', body: JSON.stringify(commentData) }),
  deleteComment: (id) => request(`/comments/${id}`, { method: 'DELETE' }),
};
