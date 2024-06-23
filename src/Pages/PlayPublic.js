import React from 'react'
import { useLocation } from 'react-router-dom';

const PlayPublic = () => {
    const {state} = useLocation();
  console.log(state);
  return (
    <div>PlayPublic</div>
  )
}

export default PlayPublic