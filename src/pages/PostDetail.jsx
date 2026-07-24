import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, ApiError, API_URL } from "../api";
import { CommentForm, CommentList } from "../components/Comments";
import GarlandDivider from "../components/GarlandDivider";
import { useAuth } from "../context/AuthContext";
import "./PostDetail.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("te-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostDetail() {
  const { slug } = useParams();
  const { admin } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setPost(null);
    setError("");
    api
      .getPost(slug)
      .then((p) => {
        setPost(p);
        api.pingVisitor(p.id).catch(() => {});
        return api.listComments(p.id);
      })
      .then(setComments)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "ఈ రాత దొరకలేదు.")
      );
  }, [slug]);

  if (error) {
    return (
      <div className="container">
        <div className="banner banner-error">{error}</div>
        <Link className="nav-link" to="/">
          ← హోమ్‌కు తిరిగి వెళ్లండి
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <p className="hint">లోడ్ అవుతోంది…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <article className="entry">
        <time className="entry-date" dateTime={post.created_at}>
          {formatDate(post.created_at)}
        </time>
        <h1 className="entry-title">{post.title}</h1>
        {!post.published && <span className="badge badge-draft">డ్రాఫ్ట్ — మీకు మాత్రమే కనిపిస్తుంది</span>}

        <div className="entry-content">{post.content}</div>

        {post.images?.length > 0 && (
          <div className="entry-images">
            {post.images.map((img) => (
              <img key={img.id} src={`${API_URL}${img.url_path}`} alt={img.alt_text || ""} />
            ))}
          </div>
        )}
      </article>

      <GarlandDivider count={7} />

      <section className="entry-comments">
        <h2 className="entry-comments-title">కామెంట్లు</h2>
        <CommentList
          postId={post.id}
          comments={comments}
          setComments={setComments}
          isAdmin={!!admin}
        />
        <div className="comment-form-wrap">
          <CommentForm
            postId={post.id}
            disabled={!post.comments_enabled}
            onPosted={(c) => setComments((prev) => [...prev, c])}
          />
        </div>
      </section>
    </div>
  );
}
