// import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import Loader from './Components/Loader';
import PrivateJoin from './Pages/PrivateJoin';

const Home = lazy(()=>import("./Pages/Home"));
const PlayPrivate = lazy(()=>import("./Pages/PlayPrivate"));
const PlayPublic = lazy(()=>import("./Pages/PlayPublic"));
const NotFound = lazy(()=>import("./Pages/NotFound"));

function App() {
  return (
    <Router>
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='*' element={<NotFound/>}/>
        <Route path='/privateJoin' element={<PrivateJoin/>}/>
        <Route path='/playPrivate' element={<PlayPrivate/>}/>
        <Route path='/playPublic' element={<PlayPublic/>}/>
      </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;
