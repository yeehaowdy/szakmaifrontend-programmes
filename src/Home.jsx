import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyMenu from "../components/MyMenu";
import "./Home.css";

const API = "http://localhost:3001";

export default function Home() {
  const [parties, setParties] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/parties`).then((r) => r.json()),
      fetch(`${API}/api/programmes`).then((r) => r.json()),
    ]).then(([partiesData, programmesData]) => {
      setParties(partiesData);
      setProgrammes(programmesData);
      setLoading(false);
    });
  }, []);

  const getProgramme = (partyId) =>
    programmes.find((p) => p.party_id === partyId);

  const handlePartyClick = (party) => {
    const prog = getProgramme(party.id);
    if (prog) navigate(`/programmes/${prog.id}`);
  };

  return (
    <div className="home-page">
      <MyMenu />
      <div className="home-content">
        <div className="content-panel">
          <h1 className="panel-title">Pártok és programjaik</h1>
          <p className="panel-subtitle">Kattints egy pártra az ígéretek megtekintéséhez.</p>

          {loading ? (
            <div className="loading">Betöltés...</div>
          ) : (
            <div className="parties-grid">
              {parties.map((party) => {
                const prog = getProgramme(party.id);
                return (
                  <div
                    key={party.id}
                    className={`party-card ${prog ? "clickable" : "no-programme"}`}
                    onClick={() => handlePartyClick(party)}
                    title={prog ? prog.title : "Nincs program"}
                  >
                    <div className="party-logo-wrap">
                      {party.image ? (
                        <img src={party.image} alt={party.name} className="party-logo" />
                      ) : (
                        <div className="party-logo-placeholder">{party.name[0]}</div>
                      )}
                    </div>
                    <div className="party-info">
                      <span className="party-name">{party.name}</span>
                      <span className="party-programme-title">
                        {prog ? prog.title : "nincs programja"}
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