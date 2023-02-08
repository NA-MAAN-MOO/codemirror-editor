import React, { useEffect, useState, useRef } from 'react';
import { useStore } from './store.js';

/* codemirror */
import { python } from '@codemirror/lang-python';
import { basicSetup } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, ViewUpdate, ViewPlugin } from '@codemirror/view';

/* socket */
import io from 'socket.io-client';

function SharedEditor() {
  const editor = useRef(null);

  /* local state 저장 */
  const [users, setUsers] = useState([]); // 웹소켓 연결에서 받을 username 리스트
  const { username, roomId } = useStore(({ username, roomId }) => ({
    username,
    roomId,
  })); // useStore에 저장한 것 디스트럭쳐링

  useEffect(() => {
    /* 에디터 인스턴스 생성 */
    const log = (event) => console.log(event.data);
    // editor.current.addEventListener('input', log);

    const state = EditorState.create({
      doc: `# Press Ctrl-Space in here... 포항항\n\n\n\n`,
      extensions: [basicSetup, python()],
    });

    /* view의 update 메소드를 통해 내용 바꿈 test */
    // let transaction = state.update({
    //   changes: { from: 0, insert: 'hello' },
    // });
    // console.log(transaction.state.doc.toString()); // "hello editor"
    // view.dispatch(transaction);

    /* 소켓 연결!!! */
    const socket = io('http://localhost:3001/', {
      transports: ['websocket'],
    });

    /* 서버로부터 "코드변경" 알림 받음 */
    socket.on('CODE_CHANGED', (code) => {
      console.log(code + '왔다!');
      if (code !== view.state.doc.toString()) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: code },
        });
      }
    });

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    /* 클라이언트가 서버소켓에 연결되면 "방 연결" 이라고 알림  */
    socket.on('connect', () => {
      // console.log('접속 됨');
      socket.emit('CONNECTED_TO_ROOM', { roomId, username });
    });

    socket.on('disconnect', () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username });
    });

    /* 서버에서 "방 연결" 알림 받으면 */
    socket.on('ROOM:CONNECTION', (users) => {
      // console.log('방 연결 됨');
      setUsers(users); // 유저 정보 변경
      console.log(`유저정보리스트 update : ${users}`);
    });

    /* 에디터가 변화를 알려줌(입력, 삭제, 등) */
    // editor.on('change', (state, changes) => {
    //   const { origin } = changes;
    //   // if (origin === '+input' || origin === '+delete' || origin === 'cut') {
    //   if (origin !== 'setValue') {  // setValue라는 변화가 아니면
    //     socket.emit('CODE_CHANGED', state.doc.toString()); // 코드변경 이벤트 알림
    //   }
    // });

    /* cursor activity 이벤트 있던 곳 */

    /* 이벤트 리스너 */
    // editor.current.addEventListener('input', (e) => {
    //   // console.log(e);
    //   if ()
    //   socket.emit('CODE_CHANGED', state.doc.toString());
    // });

    /* 첫번째 뷰플러그인 */
    // const MyViewPlugin = {
    //   // The update method will be called whenever there is a change to the view
    //   update(view, prevState) {
    //     // Only emit the socket event if the value of the editor changed
    //     if (prevState.state.doc.toString() !== view.state.doc.toString()) {
    //       // Emit the socket event with the current value of the editor
    //       socket.emit('CODE_CHANGED', view.state.doc.toString());
    //     }
    //   },
    // };

    /* 두번째 뷰 플러그인 */
    // const MyViewPlugin = (view) => {
    //   return {
    //     update(update) {
    //       if (update.docChanged) {
    //         console.log('view changed!!!!');
    //         socket.emit('CODE_CHANGED', view.state.doc.toString());
    //      }
    //     },
    //   };
    // };

    const view = new EditorView({
      state,
      parent: editor.current,
      dispatch: (tr) => {
        // this will be called every time the editor view is updated
        // console.log(tr.state.doc.toString()); // 변한 내용 출력
        // console.log(tr);
        // view.dispatch(tr);
        // console.log('Editor content updated:', tr.state.doc.toString());
        const currentContent = tr.state.doc;
        if (currentContent !== tr.startState.doc) {
          view.update([tr]);
          // console.log('내용 바꼈다!!', currentContent);
          // console.log(tr.isUserEvent('input'));
          // console.log(tr.newSelection);
          socket.emit('CODE_CHANGED', tr.state.doc.toString());
        }

        // you can send the changes to the server using socket.emit() here
        // or perform any other action that you need
      },
    });

    return () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username });
      socket.close(); // 2명 되는거 방지
      view.destroy(); // view가 여러개 생기지 못하게 방지
      // view.current.removeEventListener("input", log);
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
        <div ref={editor} />
      </div>
    </>
  );
}

export default SharedEditor;
