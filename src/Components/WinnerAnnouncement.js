import React from 'react'

function WinnerAnnouncement({ winner, finalScores }) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex-1 flex flex-col items-center justify-center mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Winner</p>
          <p className="text-4xl font-bold text-indigo-600 mb-2">{winner.name}</p>
          <p className="text-3xl font-bold text-green-600">{winner.points} points</p>
        </div>
      </div>
      
      <div className="flex-2 overflow-hidden">
        <h3 className="text-2xl font-semibold mb-4 text-center">Final Leaderboard</h3>
        <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100% - 3rem)' }}>
          <table className="w-full">
            <thead className="bg-indigo-200 sticky top-0 rounded-t-lg">
              <tr>
                <th className="py-2 px-4 text-left">Rank</th>
                <th className="py-2 px-4 text-left">Player</th>
                <th className="py-2 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {finalScores.map((player, index) => (
                <tr 
                  key={player.id} 
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  } hover:bg-indigo-100 transition-colors duration-200 ease-in-out rounded-lg shadow-sm mb-2`}
                >
                  <td className="py-3 px-4 font-medium">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{player.name}</td>
                  <td className="py-3 px-4 font-semibold text-right text-indigo-600">{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WinnerAnnouncement
