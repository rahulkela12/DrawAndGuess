import React from 'react';

const Leaderboard = ({ players,self,drawerId}) => {

  const sortedPlayers = [...players].sort((a,b)=> b.points - a.points);

  console.log(self);
  return (
    <div className="bg-gradient-to-b from-blue-800 to-blue-600 p-4 rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-3 text-center text-yellow-300 uppercase tracking-wide">Leaderboard</h2>
      <ul className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <li 
            key={index} 
            className={`flex justify-between items-center p-2 rounded ${
              self === player.id ? 'bg-yellow-400' :
              drawerId === player.id? 'bg-green-400':'bg-gray-300'
            } transition-all duration-200 hover:scale-102`}
          >
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2 w-6 text-center">
                {index + 1}
              </span>
              <span className="font-medium text-sm">{player.name}</span>
            </div>
            <span className="font-bold text-sm text-blue-800">{player.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;