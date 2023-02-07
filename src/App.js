import React from 'react';
import EnterName from './EnterName.js';
import SharedEditor from './SharedEditor.js';
import { useStore } from './store.js';

function App() {
  const username = useStore(({ username }) => username);

  /* 완성시 이걸로 */
  return <>{username ? <SharedEditor /> : <EnterName />}</>;

  /* test */
  return <>으악</>;

  /* 편집기만 */
  return (
    <>
      <SharedEditor />
    </>
  );
}

export default App;
