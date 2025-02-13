// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Matchs from './Matchs/Matchs.jsx';
import Odds from './Odds/Odds.jsx';
import Statistics from './Statistics/Statistics.jsx';
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/matchs" element={<Matchs />} />
        <Route path="/odds/:fixtureId" element={<Odds />} />
        <Route path="/statistics/:fixtureId" element={<Statistics />} />
      </Routes>
    </Router>
  </StrictMode>,
);