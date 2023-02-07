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
  const pyLang = `# Press Ctrl-Space in here...\n\n\n\n`;
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
      doc: pyLang,
      extensions: [basicSetup, python()],
    });
    const view = new EditorView({ state, parent: editor.current });

    /* hmmm 위젯 */
    const widget = document.createElement('span');
    widget.textContent = 'hmmm?';
    widget.style.cssText =
      'background: #F37381; padding: 0px 3px; color: #F3F5F1; cursor: pointer;';

    /* 유저들 커서 */
    // const bookMark = editor.setBookmark({ line: 1, pos: 1 }, { widget })
    // widget.onclick = () => bookMark.clear()
    // console.log(editor.getAllMarks())

    /* 소켓 연결!!! */
    const socket = io('http://localhost:3001/', {
      transports: ['websocket'],
    });

    // 서버로부터 "코드변경" 알림 받음
    socket.on('CODE_CHANGED', (code) => {
      console.log(code);
      editor.setValue(code);
      socket.to(`ROOM:${roomId}`).emit('CODE_CHANGED', code); // "코드변경" 이벤트 다른 소켓들에게 알림
    });

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    /* 클라이언트가 서버소켓에 연결되면 "방 연결" 이라고 알림  */
    socket.on('connect', () => {
      console.log('접속 됨');
      socket.emit('CONNECTED_TO_ROOM', { roomId, username });
    });

    socket.on('disconnect', () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username });
    });

    /* 서버에서 "방 연결" 알림 받으면 */
    socket.on('ROOM:CONNECTION', (users) => {
      console.log('방 연결 됨');
      setUsers(users); // 유저 정보 변경
      console.log(`유저정보리스트 update : ${users}`);
    });

    /* 코드미러가 변화를 알려줌(입력, 삭제, 등) */
    editor.on('change', (instance, changes) => {
      const { origin } = changes;
      // if (origin === '+input' || origin === '+delete' || origin === 'cut') {
      if (origin !== 'setValue') {
        // setValue라는 변화가 아니면
        socket.emit('CODE_CHANGED', instance.getValue()); // 코드변경 이벤트 알림
      }
    });
    editor.on('cursorActivity', (instance) => {
      // console.log(instance.cursorCoords())
    });

    return () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username });
      view.destroy(); // view가 여러개 생기지 못하게 방지
      // editor.current.removeEventListener("input", log);
    };
  }, []);

  return (
    <>
      <div>
        <div>공동 에디터</div>
        <div>Your username is: {username}</div>
        <div>The room ID is: {roomId}</div>
        <div>How many pople are connected: {users.length}</div>
        {/* <div>Your username is: 네이름</div> */}
        {/* <div>The room ID is: 네 아이디</div> */}
        {/* <div>How many pople are connected: 몇명</div> */}
        <div ref={editor}></div>
      </div>
    </>
  );
}

export default SharedEditor;
