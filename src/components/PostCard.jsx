import { Link } from "react-router-dom";
import "./PostCard.css";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("te-IN", { year: "numeric", month: "long", day: "numeric" });
}

function excerpt(text, max = 180) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export default function PostCard({ post, adminView = false }) {
  return (
    <article className="post-card">
      <div className="post-card-meta">
        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        {adminView && !post.published && <span className="badge badge-draft">డ్రాఫ్ట్</span>}
        {adminView && !post.comments_enabled && (
          <span className="badge badge-muted">కామెంట్స్ ఆఫ్</span>
        )}
      </div>
      <h2 className="post-card-title">
        <Link to={adminView ? `/dashboard/edit/${post.slug}` : `/entry/${post.slug}`}>
          {post.title}
        </Link>
      </h2>
      {post.content && <p className="post-card-excerpt">{excerpt(post.content)}</p>}
      <Link
        className="post-card-read"
        to={adminView ? `/dashboard/edit/${post.slug}` : `/entry/${post.slug}`}
      >
        {adminView ? "సవరించండి →" : "పూర్తిగా చదవండి →"}
      </Link>
    </article>
  );
}
