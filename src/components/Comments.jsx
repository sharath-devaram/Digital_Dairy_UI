import { useState } from "react";
import { api, ApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Comments.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("te-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CommentForm({ postId, onPosted, disabled }) {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (disabled) {
    return <p className="hint">ఈ రాతపై కామెంట్స్ ఆఫ్ చేయబడ్డాయి.</p>;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const comment = await api.createComment(postId, username.trim(), content.trim());
      setContent("");
      onPosted(comment);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "కామెంట్ పోస్ట్ చేయడం విఫలమైంది.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={submit}>
      {error && <div className="banner banner-error">{error}</div>}
      <div className="field">
        <label htmlFor="c-username">మీ పేరు</label>
        <input
          id="c-username"
          type="text"
          value={username}
          maxLength={80}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="c-content">మీ కామెంట్</label>
        <textarea
          id="c-content"
          rows={3}
          value={content}
          maxLength={3000}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
        {submitting ? "పోస్ట్ చేస్తోంది…" : "కామెంట్ పోస్ట్ చేయండి"}
      </button>
    </form>
  );
}

export function CommentList({ postId, comments, setComments, isAdmin }) {
  const toggleVisible = async (comment) => {
    const updated = await api.setCommentVisibility(comment.id, !comment.visible);
    setComments((prev) => prev.map((c) => (c.id === comment.id ? updated : c)));
  };

  const remove = async (comment) => {
    if (!window.confirm("ఈ కామెంట్‌ను తొలగించాలా?")) return;
    await api.deleteComment(comment.id);
    setComments((prev) => prev.filter((c) => c.id !== comment.id));
  };

  if (comments.length === 0) {
    return <p className="hint">ఇంకా కామెంట్లు లేవు. మొదటిది మీరే రాయండి.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <li key={c.id} className={`comment-item ${!c.visible ? "comment-hidden" : ""}`}>
          <div className="comment-item-head">
            <span className="comment-username">{c.username}</span>
            <time>{formatDate(c.created_at)}</time>
            {!c.visible && <span className="badge badge-muted">దాచబడింది</span>}
          </div>
          <p className="comment-content">{c.content}</p>
          {isAdmin && (
            <div className="comment-admin-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => toggleVisible(c)}>
                {c.visible ? "దాచు" : "చూపించు"}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(c)}>
                తొలగించు
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
