import { motion } from "framer-motion";
import "./CharacterSlider.css";

export default function CharacterSlider({ characters, onSelect }) {
  return (
    <section className="characters">
      <h2>Characters</h2>

      <div className="slider">
        {characters.map((char) => (
          <motion.div
            key={char.id}
            className="card"
            whileHover={{ y: -20, scale: 1.05 }}
            onClick={() => onSelect(char)}
          >
            <img src={char.image} />
            <div className="card-overlay">
              <h3>{char.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}