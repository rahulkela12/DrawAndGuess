import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const DrawingBoard = ({ socket, canDraw, drawer,setSelectedWord}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [isWordSelected, setIsWordSelected] = useState(false);
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
    setIsWordSelected(true);
    setShowOptions(false);
  };

  return (
    <div className="flex flex-col items-center">
      {!isWordSelected ? canDraw ? (
        <div className="relative mb-4 w-full">
          {showOptions && (
            <div className=" w-full h-[500px] bg-white border border-gray-300 flex flex-col items-center justify-between">
              <h2 className="text-lg font-bold mb-4 mt-20">Select a word</h2>
              <div className="flex flex-col items-center justify-center w-full mb-20">
                <button
                  onClick={() => handleWordSelection('apple')}
                  className="p-2 border border-gray-300 hover:bg-gray-100 w-full text-center mb-2"
                >
                  Apple
                </button>
                <button
                  onClick={() => handleWordSelection('banana')}
                  className="p-2 border border-gray-300 hover:bg-gray-100 w-full text-center mb-2"
                >
                  Banana
                </button>
                <button
                  onClick={() => handleWordSelection('cherry')}
                  className="p-2 border border-gray-300 hover:bg-gray-100 w-full text-center mb-2"
                >
                  Cherry
                </button>
              </div>
            </div>
          )}
        </div>
      ) : drawer ? (
        <div className="flex items-center justify-center w-full h-[500px] border border-gray-300 bg-white">
          <h1 className="text-lg font-bold capitalize">{drawer} is selecting a word</h1>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-[500px] border border-gray-300 bg-white">
          <h1 className="text-lg font-bold capitalize">Waiting for a player to join</h1>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={650}
            height={500}
            className="border border-gray-300 bg-white"
          />
          {canDraw && (
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={!canDraw}
              />
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(e.target.value)}
                disabled={!canDraw}
              />
              <button onClick={clearCanvas} disabled={!canDraw}>
                Clear Canvas
              </button>
            </div>
          )}
          <div>
            {drawer ? (
              canDraw ? (
                <p>You have access to draw</p>
              ) : (
                <p>{drawer} has access to draw</p>
              )
            ) : (
              <p className="bg-white mt-2">Waiting for more players to join...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DrawingBoard;


