import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [show, setShow] = useState(true);
  let lastScroll = 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScroll) {
        setShow(false);
      } else {
        setShow(true);
      }
      lastScroll = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${show ? "show" : "hide"}`}>
      <div className="logo">STRANGER THINGS</div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Characters</li>
        <li>Login</li>
      </ul>
    </nav>
  );
}