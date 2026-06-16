import axios from 'axios';

const API = axios.create({
  // Ensure this matches your backend port (usually 5000)
  baseURL: 'https://hirecraft-backend.onrender.com/api', 
});

// This intercepts every request and attaches your login token automatically!
API.interceptors.request.use((req) => {
  // Check local storage for the token (checking the two most common ways it gets saved)
  const exactToken = localStorage.getItem('token');
  const userInfoObj = localStorage.getItem('userInfo');

  if (exactToken) {
    req.headers.Authorization = `Bearer ${exactToken}`;
  } else if (userInfoObj) {
    try {
      const parsedUser = JSON.parse(userInfoObj);
      if (parsedUser.token) {
        req.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    } catch (error) {
      console.error("Error parsing user info from local storage");
    }
  }

  return req;
});

export default API;