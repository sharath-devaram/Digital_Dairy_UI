import { useRef, useState } from "react";
import { api, ApiError, API_URL } from "../api";
import "./ImageUploader.css";

export default function ImageUploader({ postId, images, setImages }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const image = await api.uploadImage(postId, file);
      setImages((prev) => [...prev, image]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "అప్‌లోడ్ విఫలమైంది.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (image) => {
    if (!window.confirm("ఈ ఫోటోను తొలగించాలా?")) return;
    await api.deleteImage(image.id);
    setImages((prev) => prev.filter((i) => i.id !== image.id));
  };

  return (
    <div className="image-uploader">
      <label className="field-label-standalone">ఫోటోలు</label>
      {error && <div className="banner banner-error">{error}</div>}

      <div className="image-grid">
        {images.map((img) => (
          <div className="image-tile" key={img.id}>
            <img src={`${API_URL}${img.url_path}`} alt={img.alt_text || ""} />
            <button
              type="button"
              className="image-tile-remove"
              onClick={() => remove(img)}
              aria-label="ఫోటో తొలగించండి"
            >
              ✕
            </button>
          </div>
        ))}

        <label className="image-tile image-tile-add">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => handleFile(e.target.files[0])}
            disabled={uploading}
            hidden
          />
          {uploading ? "అప్‌లోడ్ అవుతోంది…" : "+ ఫోటో జోడించండి"}
        </label>
      </div>
      <p className="hint">JPG, PNG, WEBP లేదా GIF · గరిష్టం 8MB</p>
    </div>
  );
}
