import { motion } from "framer-motion";
import "./CharacterModal.css";

export default function CharacterModal({ character, onClose }) {
  if (!character) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content">
  <div className="left">
    <img src={character.image} />
  </div>

  <div className="right">
    <h2>{character.name}</h2>
    <h4>{character.title}</h4>

    <p><strong>Type:</strong> {character.type}</p>
    <p><strong>Difficulty:</strong> {character.difficulty}</p>

    <p className="desc">{character.description}</p>

    <div className="abilities">
      <h4>Abilities</h4>
      <ul>
        {character.abilities.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>

    <div className="stats">
      <h4>Stats</h4>

      <p>Power</p>
      <div className="bar"><div style={{ width: character.stats.power + "%" }} /></div>

      <p>Speed</p>
      <div className="bar"><div style={{ width: character.stats.speed + "%" }} /></div>

      <p>Intelligence</p>
      <div className="bar"><div style={{ width: character.stats.intelligence + "%" }} /></div>
    </div>
  </div>
</div>

        <button className="close">✕</button>

    </div>
  );
}