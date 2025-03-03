import React from 'react';

const HomePage = () => {
  return (
    // thêm hình ảnh logo của Premier League vào trang chủ
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img 
        src="https://www.premierleague.com/resources/rebrand/v7.153.46/i/elements/pl-main-logo.png" 
        alt="Premier League Logo" 
        style={{ marginRight: '20px', width: '100px', height: '100px' }} 
      />
      <div>
        <h1>Welcome to Football App</h1>
        <p>Get the latest information about teams, players, and matches.</p>
      </div>
    </div>
  );
};

export default HomePage;