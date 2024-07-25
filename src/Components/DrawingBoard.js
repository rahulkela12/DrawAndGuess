import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const DrawingBoard = ({ socket, canDraw, drawer,setSelectedWord,setIsWordSelected,isWordSelected}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [showOptions, setShowOptions] = useState(true);



  useEffect(() => {
    if (!isWordSelected) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const startDrawing = (e) => {
      if (!canDraw) return;
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      socket.emit('startPath', { x, y, color, lineWidth });
      context.beginPath();
      context.moveTo(x, y);
    };

    const draw = (e) => {
      if (!isDrawing || !canDraw) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      context.lineWidth = lineWidth;
      context.lineCap = 'round';
      context.strokeStyle = color;

      context.lineTo(x, y);
      context.stroke();

      socket.emit('draw', { x, y, color, lineWidth });
    };

    const stopDrawing = () => {
      if (isDrawing && canDraw) {
        setIsDrawing(false);
        socket.emit('endPath');
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    socket.on('startPath', ({ x, y, color, lineWidth }) => {
      context.beginPath();
      context.moveTo(x, y);
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
    });

    socket.on('draw', ({ x, y }) => {
      context.lineTo(x, y);
      context.stroke();
    });

    socket.on('endPath', () => {
      context.beginPath();
    });

    socket.on('clearCanvas', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [isDrawing, color, lineWidth, socket, canDraw, isWordSelected]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearCanvas');
  };

  const handleWordSelection = (word) => {
    setSelectedWord(word);
    socket.emit('word',{word});
    setIsWordSelected(true);
//    setShowOptions(false);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg">
      {!isWordSelected ? canDraw ? (
        <div className="relative mb-4 w-full">
          {showOptions && (
            <div className="w-full h-[500px] bg-white border-2 border-blue-300 rounded-lg flex flex-col items-center justify-between shadow-md">
              <h2 className="text-2xl font-bold mb-4 mt-20 text-blue-600">Select a word</h2>
              <div className="flex flex-col items-center justify-center w-full mb-20 space-y-4">
                {['apple', 'banana', 'cherry'].map((word) => (
                  <button
                    key={word}
                    onClick={() => handleWordSelection(word)}
                    className="p-3 border-2 border-blue-300 hover:bg-blue-100 w-3/4 text-center rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {word.charAt(0).toUpperCase() + word.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : drawer ? (
        <div className="flex items-center justify-center w-full h-[500px] border-2 border-blue-300 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold capitalize text-blue-600">{drawer} is selecting a word</h1>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-[500px] border-2 border-blue-300 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold capitalize text-blue-600">Waiting for a player to join</h1>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={650}
            height={500}
            className="border-2 border-blue-300 bg-white rounded-lg shadow-md"
          />
          {canDraw && (
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-lg shadow-md">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={!canDraw}
                className="w-12 h-12 rounded-full cursor-pointer"
              />
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(e.target.value)}
                disabled={!canDraw}
                className="w-48 accent-blue-600"
              />
              <button 
                onClick={clearCanvas} 
                disabled={!canDraw}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Clear Canvas
              </button>
            </div>
          )}
          <div className="mt-4 text-center">
            {drawer ? (
              canDraw ? (
                <p className="bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-full">You have access to draw</p>
              ) : (
                <p className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full">{drawer} has access to draw</p>
              )
            ) : (
              <p className="bg-yellow-100 text-yellow-800 font-semibold py-2 px-4 rounded-full">Waiting for more players to join...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DrawingBoard;


