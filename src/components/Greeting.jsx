import React, { useState } from 'react';


export default function Greeting({messages}) {

  const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div style={{marginLeft: '1rem'}}>
      <span className="text-primary">{greeting}！感谢来访！</span><br/>
      <button onClick={() => setGreeting(randomMessage())} style={{background: '#b3afaf'}}>
        点我, PLEASE!
      </button>
    </div>
  );
}