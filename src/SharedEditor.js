import React, { useEffect, useState, useRef } from 'react';
import { useStore } from './store.js';

/* codemirror */
// import { CodeMirror, useCodeMirror } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { basicSetup, keymap, defaultKeymap } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

/* socket */
import io from 'socket.io-client';

function SharedEditor() {
  /* pylang 플레이스홀더 */
  const pyLang = `# Press Ctrl-Space in here...`;
  const editor = useRef(null);

  /* local state 저장 */
  const [users, setUsers] = useState([]); // 웹소켓 연결에서 받을 username 리스트
  const { username, roomId } = useStore(({ username, roomId }) => ({
    username,
    roomId,
  })); // useStore에 저장한 것 디스트럭쳐링

  useEffect(() => {
    /* 에디터 인스턴스 생성 */
    const log = (event) => console.log(event);
    // editor.current.addEventListener("input", log);
    const state = EditorState.create({
      doc: `# Press Ctrl-Space in here...\n\n`,
      extensions: [basicSetup, python()],
    });
    const view = new EditorView({ state, parent: editor.current });

    /* 소켓 연결!!! */
    const socket = io('http://localhost:3001/', {
      transports: ['websocket'],
    });

    // 서버로부터 "코드변경" 알림 받음
    socket.on('CODE_CHANGED', (code) => {
      console.log(code);
      // editor.setValue(code);
    });

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    /* 클라이언트가 서버소켓에 연결되면 "방 연결" 이라고 알림  */
    socket.on('connect', () => {
      socket.emit('CONNECTED_TO_ROOM', { roomId, username });
    });

    socket.on('disconnect', () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username });
    });

    /* 서버에서 "방 연결" 알림 받으면 */
    socket.on('ROOM:CONNECTION', (users) => {
      setUsers(users); // 유저 정보 변경
      console.log(users);
    });

    return () => {
      view.destroy(); // view가 여러개 생기지 못하게 방지
      // editor.current.removeEventListener("input", log);
    };
  }, []);

  return (
    <>
      <p>
        <p> 공동 에디터</p>
        <p>Your username is: {username}</p>
        <p>The room ID is: {roomId}</p>
        <p>How many pople are connected: {users.length}</p>
        <p>Your username is: 네이름</p>
        <p>The room ID is: 네 아이디</p>
        <p>How many pople are connected: 몇명</p>
      </p>
      <div ref={editor}></div>
    </>
  );
}

export default SharedEditor;
