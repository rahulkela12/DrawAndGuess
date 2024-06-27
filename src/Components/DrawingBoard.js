import React from 'react';

const DrawingBoard = () => {
  return (
    <div className="bg-gray-100 flex-1 h-[calc(100vh-17.5rem)] flex items-center justify-center">
      <canvas id='demoCanvas'/>
    </div>
  );
};

export default DrawingBoard;
