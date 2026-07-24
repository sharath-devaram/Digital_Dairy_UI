import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", paddingTop: 40 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>ఈ పేజీ దొరకలేదు</h1>
      <Link className="nav-link" to="/">
        ← హోమ్‌కు తిరిగి వెళ్లండి
      </Link>
    </div>
  );
}
