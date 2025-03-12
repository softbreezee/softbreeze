import React from 'react';

const MyReactComponent = () => {
  return (
    <div style={{ display: 'flex', border: '1px solid #ccc', padding: '10px', width: '300px' }}>
      <img src="https://via.placeholder.com/100" alt="Placeholder" style={{ width: '100px', height: '100px', marginRight: '10px' }} />
      <div>
        <h3>Card Title</h3>
        <p>This is a description of the card content.</p>
      </div>
    </div>
  );
};

export default MyReactComponent;
