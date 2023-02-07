import React, { useEffect, useState, useRef } from 'react';
import { useStore } from './store';

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

  useEffect(() => {
    /* 에디터 인스턴스 생성 */
    const log = (event) => console.log(event);
    // editor.current.addEventListener("input", log);
    const state = EditorState.create({
      doc: `# Press Ctrl-Space in here...\n\n`,
      extensions: [basicSetup, python()],
    });
    const view = new EditorView({ state, parent: editor.current });
    return () => {
      view.destroy(); // view가 여러개 생기지 못하게 방지
      // editor.current.removeEventListener("input", log);
    };
  }, []);

  return (
    <>
      <p>
        <p> 공동 에디터</p>
        <p>Your username is: 네이름</p>
        <p>The room ID is: 네 아이디</p>
        <p>How many pople are connected: 몇명</p>
      </p>
      <div ref={editor}></div>
    </>
  );
}

export default SharedEditor;
