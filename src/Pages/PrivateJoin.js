import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


const PrivateJoin = () => {
    const [code,setCode] = useState("");
    let { state} = useLocation();
    const navigate = useNavigate();
    state = {...state,code}; 
    const createRoom = ()=>{
        navigate("/playPrivate", { state });
    }
    const joinRoom = ()=>{
        console.log("join Room");
        navigate('/privatePlay',{state});
        // navigate("/playPublic",{state});
    }
    return (
     <div className='flex justify-between flex-col'>
     <h1 className="bg-clip-text text-transparent  bg-gradient-to-l from-yellow-500 via-red-400 to-green-500 text-8xl font-bold mb-8 mt-12 text-center animate-bounce">Draw and Guess</h1>    
    <main>
    <div className="flex items-center justify-center w-full mt-20">
    <div className="panel flex flex-wrap min-h-60 h-full w-96 bg-indigo-500 bg-opacity-60 rounded-lg p-8 shadow-2xl justify-between">
    <input
                className="w-full rounded h-10 border border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type="text"
                spellCheck="false"
                autoComplete="off"
                placeholder="Enter code"
                maxLength={21}
                size={40}
                required
              />
     <input
              className="btn1 bg-blue-500 text-white rounded h-15 mb-2 w-full hover:bg-blue-700 cursor-pointer transition-all duration-300"
              type="button"
              name="joinRoom"
              value="JoinRoom"
              onClick={joinRoom}
            />
            <input
              className="btn2 bg-green-500 text-white rounded h-15 mt-2 hover:bg-green-700 cursor-pointer transition-all duration-300 w-full"
              type="button"
              value="Create Private Room"
              onClick={createRoom}
            />         
    </div>
    </div>
    </main>
    </div>
  )
}

export default PrivateJoin