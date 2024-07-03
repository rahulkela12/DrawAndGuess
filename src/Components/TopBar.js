import React from 'react';

const TopBar = ({ timeLeft, round, totalRounds }) => {
  return (
    <div className="w-full bg-blue-500 text-white p-4 flex justify-between items-center">
      <span>Round {round} of {totalRounds}</span>
      <span>Timer: {timeLeft}s</span>
    </div>
  );
};

export default TopBar;