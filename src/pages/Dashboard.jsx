import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "../api";
import PostCard from "../components/PostCard";
import "./Dashboard.css";

export default function Dashboard() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listPosts()
      .then(setPosts)
      .catch((err) => setError(err instanceof ApiError ? err.message : "లోడ్ చేయడంలో లోపం."));
  }, []);

  return (
    <div className="container">
      <div className="dashboard-head">
        <h1>మీ రాతలు</h1>
        <Link to="/dashboard/new" className="btn btn-primary btn-sm">
          + కొత్త రాత
        </Link>
      </div>

      {error && <div className="banner banner-error">{error}</div>}
      {posts === null && !error && <p className="hint">లోడ్ అవుతోంది…</p>}
      {posts && posts.length === 0 && (
        <p className="hint">ఇంకా ఏమీ రాయలేదు. మీ మొదటి రాత మొదలుపెట్టండి.</p>
      )}

      {posts && posts.map((post) => <PostCard key={post.id} post={post} adminView />)}
    </div>
  );
}
