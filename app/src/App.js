import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';

// Import styling.
import './styles/App.css'

/**
 * App is responsible for loading data and routing to other pages.
 *
 * @author Szymon Jedrzychowski
 */
function App() {
  return (
    <div className="App">
      <div className="content">
        <Routes>
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
