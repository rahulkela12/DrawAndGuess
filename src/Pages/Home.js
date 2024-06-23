import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Home = () => {

    const navigate = useNavigate();
   const [name,setName] = useState("");
   const [lang,setLang] = useState(0);
   const languages = ["Select language","English"];
   const selectChange = (e)=>{
    setLang(e.target.value);
   };


   const playPrivate = ()=>{
    if(name === "" || lang === 0 ){
        toast.error("Please Select all Fields");
        return;
    }
    const state = {
        name,
        language:languages[lang],
    }
     navigate("/playPrivate",{state});
   };
   const playPublic = ()=>{
    if(name === "" || lang === 0 ){
        toast.error("Please Select all Fields");
        return;
    }
    const state = {
        name,
        language:languages[lang],
    }
     navigate("/playPublic",{state});
   };
  return (
    <div className='home'>
    <section></section>
    <h1 className='multicolortext'>Draw and Guess</h1>
    <main>
    <div className="panels">
    <div className='panel'>
    <div className="container-name-lang">
    <input className="input-name" value={name} onChange={(e)=>setName(e.target.value)}
    type="text" spellCheck="false" autoComplete="off" placeholder="Enter your name" maxLength={21} size={40}  required/>
    <select className='select-lang' value={lang} onChange={selectChange} required>
    <option value={0}>Select language</option>
    <option value={1}>English</option>
    </select>
    </div>
    <div className='avatar'></div>
    <input className='btn1' type='button' name='Public' value="Public" onClick={playPublic}/>
    <input className='btn2' type='button' value="Private" onClick={playPrivate}></input>
    </div>
    </div>
    </main>
    </div>
  )
}

export default Home

