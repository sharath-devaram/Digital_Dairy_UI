const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "diary_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, isForm = false, auth = true } = {}) {
  const headers = {};
  if (!isForm && body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = (data && data.detail) || res.statusText || "Something went wrong";
    throw new ApiError(typeof message === "string" ? message : "Something went wrong", res.status);
  }

  return data;
}

export const api = {
  // auth
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: { username, password }, auth: false }),
  me: () => request("/auth/me"),
  changePassword: (current_password, new_password) =>
    request("/auth/change-password", { method: "POST", body: { current_password, new_password } }),
  changeUsername: (current_password, new_username) =>
    request("/auth/change-username", { method: "POST", body: { current_password, new_username } }),

  // posts
  listPosts: (params = "") => request(`/posts${params}`, { auth: !!getToken() }),
  getPost: (slug) => request(`/posts/${slug}`, { auth: !!getToken() }),
  createPost: (payload) => request("/posts", { method: "POST", body: payload }),
  updatePost: (id, payload) => request(`/posts/${id}`, { method: "PUT", body: payload }),
  deletePost: (id) => request(`/posts/${id}`, { method: "DELETE" }),

  // images
  uploadImage: (postId, file, altText) => {
    const form = new FormData();
    form.append("file", file);
    if (altText) form.append("alt_text", altText);
    return request(`/posts/${postId}/images`, { method: "POST", body: form, isForm: true });
  },
  deleteImage: (imageId) => request(`/images/${imageId}`, { method: "DELETE" }),

  // comments
  listComments: (postId) => request(`/posts/${postId}/comments`, { auth: !!getToken() }),
  createComment: (postId, username, content) =>
    request(`/posts/${postId}/comments`, {
      method: "POST",
      body: { username, content },
      auth: false,
    }),
  setCommentVisibility: (commentId, visible) =>
    request(`/comments/${commentId}/visibility?visible=${visible}`, { method: "PATCH" }),
  deleteComment: (commentId) => request(`/comments/${commentId}`, { method: "DELETE" }),
  toggleCommentsEnabled: (postId, enabled) =>
    request(`/posts/${postId}/comments-enabled?enabled=${enabled}`, { method: "PATCH" }),

  // visitors
  pingVisitor: (postId) =>
    request(`/visitors/ping${postId ? `?post_id=${postId}` : ""}`, { method: "POST", auth: false }),
  visitorCount: (postId) =>
    request(`/visitors/count${postId ? `?post_id=${postId}` : ""}`, { auth: false }),
};

export { ApiError, API_URL };
