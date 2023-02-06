import React, { useEffect, useState } from 'react';
import { socket } from '../App.js';

const DemoClient = () => {
  const [response, setResponse] = useState(['USER 1']);

  useEffect(() => {
    socket.on('socketDemoResponse', (resp) => {
      const copy = response;
      const newResponse = resp;
      copy.push(newResponse);
      setResponse(copy);
    });
  }, [response]);

  return (
    <ul>
      {response.map((res) => (
        <li key={res}>{res}</li>
      ))}
    </ul>
  );
};

export default DemoClient;
