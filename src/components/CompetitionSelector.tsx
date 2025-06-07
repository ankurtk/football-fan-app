import React from 'react';

interface CompetitionSelectorProps {
  selectedLeague: number;
  onLeagueChange: (league: number) => void;
  className?: string;
  showAllOption?: boolean; // Add this prop
  allOptionLabel?: string; // Add this prop
}

const CompetitionSelector: React.FC<CompetitionSelectorProps> = ({
  selectedLeague,
  onLeagueChange,
  className = '',
  showAllOption = false,
  allOptionLabel = 'All Leagues'
}) => {
  const competitions = [
    { id: 39, name: 'Premier League', country: 'England' },
    { id: 140, name: 'La Liga', country: 'Spain' },
    { id: 135, name: 'Serie A', country: 'Italy' },
    { id: 78, name: 'Bundesliga', country: 'Germany' },
    { id: 61, name: 'Ligue 1', country: 'France' },
    { id: 2, name: 'UEFA Champions League', country: 'Europe' },
    { id: 3, name: 'UEFA Europa League', country: 'Europe' },
  ];

  return (
    <select
      value={selectedLeague}
      onChange={(e) => onLeagueChange(Number(e.target.value))}
      className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${className}`}
    >
      {showAllOption && (
        <option value={0}>{allOptionLabel}</option>
      )}
      {competitions.map((comp) => (
        <option key={comp.id} value={comp.id}>
          {comp.name} ({comp.country})
        </option>
      ))}
    </select>
  );
};

export default CompetitionSelector;