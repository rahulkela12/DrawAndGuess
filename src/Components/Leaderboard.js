import React from 'react';

const Leaderboard = ({ players }) => {
  const leaderboardHeight = players.length * 16 + 80;
  return (
    <div className={`bg-gray-200 p-4 rounded-lg h-${leaderboardHeight} `}>
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index} className="mb-2 flex justify-between">
            <span>{player.name}</span>
            <span className="ml-2 text-sm text-gray-600">{player.points} points</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
