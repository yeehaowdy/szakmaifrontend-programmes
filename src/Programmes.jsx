import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyMenu from "../components/MyMenu";
import "./Programmes.css";

const API = "http://localhost:3001";

const CATEGORY_COLORS = {
  Gazdaság: "#3b82f6",
  Család: "#ec4899",
  Munkaerőpiac: "#f59e0b",
  Közszolgáltatások: "#10b981",
  Energia: "#f97316",
  Korrupció: "#8b5cf6",
  Vármegyerendszer: "#6b7280",
  Szociális: "#06b6d4",
  Oktatás: "#84cc16",
  Egészségügy: "#ef4444",
  Lakhatás: "#a78bfa",
};

export default function Programmes() {
  const { id } = useParams();
  const [promises, setPromises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/promises/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPromises(data);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="programmes-page">
      <MyMenu />
      <div className="programmes-content">
        <div className="content-panel">
          <h1 className="panel-title">Program ígéretei</h1>
          <p className="panel-subtitle">Program azonosító: {id}</p>

          {loading ? (
            <div className="loading">Betöltés...</div>
          ) : promises.length === 0 ? (
            <div className="empty-state">Nincs ígéret ehhez a programhoz.</div>
          ) : (
            <div className="promises-grid">
              {promises.map((promise) => {
                const color = CATEGORY_COLORS[promise.category] || "#64748b";
                return (
                  <div key={promise.id} className="promise-card">
                    <div className="promise-header">
                      <span className="promise-title">{promise.title}</span>
                      <span
                        className="promise-category"
                        style={{ background: color }}
                      >
                        {promise.category}
                      </span>
                    </div>
                    <p className="promise-description">{promise.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}