import React from 'react'
import { useLocation } from 'react-router-dom'

const PlayPrivate = () => {
  const {state} = useLocation();
  console.log(state); 
  return (
    <div>playPrivate</div>
  )
}

export default PlayPrivate