import React from "react";
import "./Footer.css";
import { useTheme } from "../context/ThemeContext";
import logo1 from "../images/logo1.png";
import logo2 from "../images/logo2.png";

export default function Footer() {
  const { theme } = useTheme();
  const logos = theme === "dark" ? logo1 : logo2;

  return (
    <>
      <footer>
        <div className="footerLogo">
          <img
            src={logos}
            alt="Logo"
            style={{ width: "70px", height: "auto" }}
          />
        </div>
        <p>© 2024 Leffaistuinpeli</p>
      </footer>
    </>
  );
}
