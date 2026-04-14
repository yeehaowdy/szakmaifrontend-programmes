import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyMenu from "../components/MyMenu";
import "./SearchResult.css";

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

export default function SearchResult() {
  const { searchedWord } = useParams();
  const [results, setResults] = useState([]);
  const [parties, setParties] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/promises/${encodeURIComponent(searchedWord)}`).then((r) => r.json()),
      fetch(`${API}/api/parties`).then((r) => r.json()),
      fetch(`${API}/api/programmes`).then((r) => r.json()),
    ]).then(([searchData, partiesData, programmesData]) => {
      setResults(Array.isArray(searchData) ? searchData : []);
      setParties(partiesData);
      setProgrammes(programmesData);
      setLoading(false);
    });
  }, [searchedWord]);

  const getPartyForProgramme = (programmeId) => {
    const prog = programmes.find((p) => p.id === programmeId);
    if (!prog) return null;
    return parties.find((p) => p.id === prog.party_id);
  };

  return (
    <div className="search-page">
      <MyMenu />
      <div className="search-content">
        <div className="content-panel">
          <h1 className="panel-title">Keresési találatok</h1>
          <p className="panel-subtitle">
            Keresett kifejezés: <strong>{searchedWord}</strong>
          </p>

          {loading ? (
            <div className="loading">Keresés...</div>
          ) : results.length === 0 ? (
            <div className="no-results">
              „<strong>{searchedWord}</strong>" részletre nincs találat...
            </div>
          ) : (
            <div className="results-grid">
              {results.map((result) => {
                const catColor = CATEGORY_COLORS[result.category] || "#64748b";
                const party = getPartyForProgramme(result.programme_id);
                return (
                  <div key={result.promise_id} className="result-card">
                    {party && (
                      <div className="result-party-row">
                        <div className="result-party-logo-wrap">
                          {party.image ? (
                            <img
                              src={party.image}
                              alt={party.name}
                              className="result-party-logo"
                            />
                          ) : (
                            <div className="result-party-logo-placeholder">
                              {party.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="result-party-info">
                          <span className="result-party-name">{party.name}</span>
                          <span className="result-party-fullname">{party.full_name}</span>
                        </div>
                      </div>
                    )}
                    <div className="result-body">
                      <div className="result-field">
                        <span className="result-label">Program:</span>{" "}
                        <span className="result-value">
                          {result.programme_title || "nincs programja"}
                        </span>
                      </div>
                      <div className="result-field">
                        <span className="result-label">Ígéret:</span>{" "}
                        <span className="result-value promise-title-text">
                          {result.promise_title}
                        </span>
                      </div>
                      <p className="result-description">{result.description}</p>
                      <span
                        className="result-category"
                        style={{ background: catColor }}
                      >
                        {result.category}
                      </span>
                    </div>
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