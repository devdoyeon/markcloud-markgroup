import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='main container column'>
      <button onClick={() => navigate('/business')}>그룹웨어로 이동</button>
    </div>
  );
};

export default Home;
