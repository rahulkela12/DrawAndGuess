import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const DrawingBoard = ({ socket }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);

  


  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const startDrawing = (e) => {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      socket.emit('startPath', { x, y, color, lineWidth });
      context.beginPath();
      context.moveTo(x, y);
    };

    const draw = (e) => {
      if (!isDrawing) return;

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
      if (isDrawing) {
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
  }, [isDrawing, color, lineWidth, socket]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearCanvas');
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={650}
        height={500}
        className="border border-gray-300 bg-white"
      />
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-1"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="w-full sm:w-auto"
        />
        <button
          onClick={clearCanvas}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default DrawingBoard;