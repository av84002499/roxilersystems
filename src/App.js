import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./page/Main";
import Month from "./page/Month"
const App = () => {
  return (
    <div>
      <Routes>
        <Route key="Main" path="/Main" element={<Main />} />
        <Route key="Month" path="/" element={<Month />} />
      </Routes>
    </div>
  )
}

export default App