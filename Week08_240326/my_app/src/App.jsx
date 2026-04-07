import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CharacterSlider from "./components/CharacterSlider";
import CharacterModal from "./components/CharacterModal";
import { characters } from "./data/characters";

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Navbar />
      <Hero />
      <CharacterSlider characters={characters} onSelect={setSelected} />
      <CharacterModal character={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default App;