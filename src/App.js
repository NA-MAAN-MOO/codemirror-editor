import React from 'react';
import EnterName from './EnterName';
import SharedEditor from './SharedEditor';
import { useStore } from './store';

function App() {
  const username = useStore(({ username }) => username);

  /* 완성시 이걸로 */
  // return <>{username ? <SharedEditor /> : <EnterName />}</>;

  /* test */
  // return <>으악</>;

  /* 편집기만 */
  return (
    <>
      <SharedEditor />
    </>
  );
}

export default App;
