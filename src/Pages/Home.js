import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lang, setLang] = useState(0);
  const languages = ["Select language", "English"];

  const selectChange = (e) => {
    setLang(e.target.value);
  };

  const playPrivate = () => {
    if (name === "" || lang === 0) {
      toast.error("Please Select all Fields");
      return;
    }
    const state = {
      name,
      language: languages[lang],
    }
    navigate("/privateJoin", { state });
  };

  const playPublic = () => {
    if (name === "" || lang === 0) {
      toast.error("Please Select all Fields");
      return;
    }
    const state = {
      name,
      language: languages[lang],
    }
    navigate("/playPublic", { state });
  };

  return (
    <div className="home">
      <h1 className="bg-clip-text text-transparent bg-gradient-to-l from-yellow-500 via-red-400 to-green-500 text-8xl font-bold mb-8 mt-12 text-center animate-bounce">Draw and Guess</h1> 
       <main>
        <div className="flex items-center justify-center w-full">
          <div className="panel flex flex-wrap justify-between h-auto w-96 bg-blue-600 bg-opacity-60 rounded-lg p-8 shadow-2xl ">
            <div className="flex justify-between mb-4">
              <input
                className="input-name mr-4 pl-2 w-2/3 rounded h-10 border border-gray-300 focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                spellCheck="false"
                autoComplete="off"
                placeholder="Enter your name"
                maxLength={21}
                size={40}
                required
              />
              <select className="select-lang w-2/4  text-sm rounded border border-gray-300 focus:outline-none focus:border-blue-500" value={lang} onChange={selectChange} required>
                <option className='' value={0}>Select language</option>
                <option value={1}>English</option>
              </select>
            </div>
            <div className="avatar h-40 mb-4 w-full">
              {/* Add avatar or other image here */}
            </div>
            <input
              className="btn1 bg-blue-500 text-white rounded h-10 mb-2 w-full hover:bg-blue-700 cursor-pointer transition-all duration-300"
              type="button"
              name="Public"
              value="Play!"
              onClick={playPublic}
            />
            <input
              className="btn2 bg-green-500 text-white rounded h-10 hover:bg-green-700 cursor-pointer transition-all duration-300 w-full"
              type="button"
              value="Private Room"
              onClick={playPrivate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;