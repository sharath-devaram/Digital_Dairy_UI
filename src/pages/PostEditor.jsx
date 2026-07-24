import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../api";
import ImageUploader from "../components/ImageUploader";
import "./PostEditor.css";

export default function PostEditor() {
  const { slug } = useParams(); // undefined => creating a new post
  const isEditing = Boolean(slug);
  const navigate = useNavigate();

  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    api
      .getPost(slug)
      .then((post) => {
        setPostId(post.id);
        setTitle(post.title);
        setContent(post.content);
        setPublished(post.published);
        setCommentsEnabled(post.comments_enabled);
        setImages(post.images || []);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "లోడ్ చేయడంలో లోపం."))
      .finally(() => setLoading(false));
  }, [slug, isEditing]);

  const save = async (publishOverride) => {
    setError("");
    setNotice("");
    setSaving(true);
    try {
      if (isEditing) {
        const payload = { title, content };
        if (publishOverride !== undefined) payload.published = publishOverride;
        const updated = await api.updatePost(postId, payload);
        setPublished(updated.published);
        setNotice("భద్రపరచబడింది.");
      } else {
        const created = await api.createPost({
          title,
          content,
          published: publishOverride ?? published,
        });
        navigate(`/dashboard/edit/${created.slug}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "భద్రపరచడంలో లోపం.");
    } finally {
      setSaving(false);
    }
  };

  const toggleComments = async () => {
    const next = !commentsEnabled;
    await api.toggleCommentsEnabled(postId, next);
    setCommentsEnabled(next);
  };

  const remove = async () => {
    if (!window.confirm("ఈ రాతను శాశ్వతంగా తొలగించాలా? దీన్ని వెనక్కి తీసుకోలేరు.")) return;
    await api.deletePost(postId);
    navigate("/dashboard", { replace: true });
  };

  if (loading) {
    return (
      <div className="container">
        <p className="hint">లోడ్ అవుతోంది…</p>
      </div>
    );
  }

  return (
    <div className="container editor-page">
      <div className="editor-head">
        <h1>{isEditing ? "రాత సవరించండి" : "కొత్త రాత"}</h1>
        {isEditing && (
          <span className={`badge ${published ? "badge-live" : "badge-draft"}`}>
            {published ? "ప్రచురించబడింది" : "డ్రాఫ్ట్"}
          </span>
        )}
      </div>

      {error && <div className="banner banner-error">{error}</div>}
      {notice && <div className="banner banner-success">{notice}</div>}

      <div className="field">
        <label htmlFor="title">శీర్షిక</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ఈ రోజు ఏం జరిగింది?"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="content">మీ కథ</label>
        <textarea
          id="content"
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ఇక్కడ మీ రోజువారీ కథ రాయండి…"
          required
        />
      </div>

      {isEditing && (
        <ImageUploader postId={postId} images={images} setImages={setImages} />
      )}

      <div className="editor-actions">
        <button
          className="btn btn-primary"
          disabled={saving || !title.trim() || !content.trim()}
          onClick={() => save(isEditing ? undefined : false)}
        >
          {saving ? "భద్రపరుస్తోంది…" : "భద్రపరచండి"}
        </button>

        {!published ? (
          <button
            className="btn btn-ghost"
            disabled={saving || !title.trim() || !content.trim()}
            onClick={() => save(true)}
          >
            ప్రచురించండి
          </button>
        ) : (
          <button className="btn btn-ghost" disabled={saving} onClick={() => save(false)}>
            అన్‌పబ్లిష్ చేయండి
          </button>
        )}

        {isEditing && (
          <button className="btn btn-ghost" onClick={toggleComments}>
            కామెంట్స్ {commentsEnabled ? "ఆఫ్ చేయండి" : "ఆన్ చేయండి"}
          </button>
        )}

        {isEditing && (
          <button className="btn btn-danger" onClick={remove}>
            తొలగించండి
          </button>
        )}
      </div>
    </div>
  );
}
