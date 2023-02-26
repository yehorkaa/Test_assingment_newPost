import React from "react";
import TTNNav from "../TTNpage/TTNnav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import BranchesList from "../BranchesList/BranchesList"
import { Suspense } from "react";

function App() {
  return (
    <Router>
      <Suspense>
        <Routes className="mainPage">
          
          <Route path="/" element={<TTNNav />} />
          <Route  path="/Branches" element={<BranchesList/>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
