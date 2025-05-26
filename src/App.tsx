import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MatchesPage from './pages/MatchesPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import PlayersPage from './pages/PlayersPage';
import AreasPage from './pages/AreasPage';
import NotFoundPage from './pages/NotFoundPage';
import MatchDetailPage from './pages/MatchDetailPage';
import AreaDetailPage from './pages/AreaDetailPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamDetailPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/players/:id" element={<PlayerDetailPage />} />
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/areas/:id" element={<AreaDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;