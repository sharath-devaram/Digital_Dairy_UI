import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import PostCard from "../components/PostCard";
import GarlandDivider from "../components/GarlandDivider";
import { Fragment } from "react";
import "./Home.css";

export default function Home() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");
  const [totalVisitors, setTotalVisitors] = useState(null);

  useEffect(() => {
    api.pingVisitor(null).catch(() => {});
    api
      .visitorCount(null)
      .then((r) => setTotalVisitors(r.total))
      .catch(() => {});

    api
      .listPosts()
      .then(setPosts)
      .catch((err) => setError(err instanceof ApiError ? err.message : "లోడ్ చేయడంలో లోపం."));
  }, []);

  return (
    <div className="container">
      <div className="home-intro">
        <h1 className="home-title">నా జీవిత రోజువారీ కథలు</h1>
        <p className="home-sub hint">
          {totalVisitors !== null
            ? `ఇప్పటివరకు ${totalVisitors} సందర్శనలు`
            : "\u00A0"}
        </p>
      </div>

      <GarlandDivider />

      {error && <div className="banner banner-error">{error}</div>}

      {posts === null && !error && <p className="hint">లోడ్ అవుతోంది…</p>}

      {posts && posts.length === 0 && (
        <p className="hint">ఇంకా ఏ రాతలు ప్రచురించలేదు. త్వరలో వస్తాయి!</p>
      )}

      {posts &&
        posts.map((post, i) => (
          <Fragment key={post.id}>
            <PostCard post={post} />
          </Fragment>
        ))}
    </div>
  );
}
