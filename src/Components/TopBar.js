import React, { useEffect, useState } from 'react';

const TopBar = ({ timeLeft, round, totalRounds,selectedWord,isWordSelected}) => {
  const [blank,setBlank] = useState("");
  useEffect(()=>{
    let temp = "";
  for(let i=0;i<selectedWord.length;i++){
    temp += "_ ";
  }
  setBlank(temp);
  },[selectedWord]);
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 flex justify-between items-center shadow-lg rounded-b-lg">
      <div className="flex items-center space-x-4">
        <span className="text-lg font-semibold">Round {round} of {totalRounds}</span>
      </div>
      {
        isWordSelected && (
          <span className="text-lg font-semibold">{blank}</span>)
      }      
      <div className="flex items-center space-x-4">
        <span className="text-lg font-semibold">Timer:</span>
        <span className="text-2xl font-bold">{timeLeft}s</span>
      </div>
    </div>
  );
};

export default TopBar;
