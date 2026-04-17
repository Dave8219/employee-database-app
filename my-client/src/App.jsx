import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RenderEmployees from "./Employees";
import RenderHeader from "./Header.jsx";

function App() {
  return (
    <>
      <RenderHeader />
      <RenderEmployees />
    </>
  );
}

export default App;
