import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import { WebrtcProvider } from './y-webrtc';
import CodeMirror from 'codemirror';
import { useEffect, useState } from 'react';
import short from 'short-uuid';
import { useParams, useNavigate } from 'react-router-dom';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/mode/simple.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import mode from './mode-glicol';
import { randomHex } from 'randomize-hex';

const Editor = () => {
  let navigate = useNavigate();

  const [name, setName] = useState('사용자 이름');
  const [color, setColor] = useState('#008833');

  let { id } = useParams();
  console.log(id);

  CodeMirror.defineSimpleMode('simplemode', mode);

  const connect = (room) => {
    try {
      const ydoc = new Y.Doc();
      const provider = new WebrtcProvider(room, ydoc);
      const yText = ydoc.getText('codemirror');
      const yUndoManager = new Y.UndoManager(yText);

      const e = new CodeMirror(document.getElementById('editor'), {
        mode: 'simplemode',
        lineNumbers: true,
        theme: 'material-darker',
      });
      window.binding = new CodemirrorBinding(yText, e, provider.awareness, {
        yUndoManager,
      });
      console.log('connect to', room);
      window.binding.awareness.setLocalStateField('user', {
        color: color,
        name: name,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const copy = () => {
    let copyText = document.getElementById('myInput');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Link copied!');
  };

  const newRoom = () => {
    let uuid = short.generate();
    // connect(uuid);
    navigate(uuid);
  };

  useEffect(() => {
    if (id) {
      connect(id);
    }
    console.log('effect');
  }, [id]);
  return (
    <div>
      {id ? (
        <>
          <p style={{ display: 'inline' }}>
            다음 링크를 복사해서 다른 사람 초대하세요:
          </p>
          <input
            readOnly
            type="text"
            value={`https://0t7bn.csb.app/${id}`}
            size="50"
            id="myInput"
          />
          <button onClick={copy}>copy</button> <br />
          <br />
          <p style={{ display: 'inline' }}>이름 바꿔보세여: </p>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              window.binding.awareness.setLocalStateField('user', {
                color: '#008833',
                name: e.target.value,
              });
            }}
            size="15"
            id="name"
          />
          <button
            style={{ backgroundColor: color }}
            onClick={() => {
              let c = randomHex();
              setColor(c);
              window.binding.awareness.setLocalStateField('user', {
                color: c,
                name: name,
              });
            }}
          >
            Change a color
          </button>
        </>
      ) : (
        <div className="m-10">
          <ol>
            <li>"IDE 켜기"를 누르세요</li>
            <li>생성된 url을 복사하세요</li>
            <li>새 창을 키거나 다른 사람을 초대해서 test 해보세요</li>
          </ol>
          <button
            className="hover:bg-indigo-200 bg-indigo-300 text-yellow-800 shadow rounded py-1 px-5"
            onClick={newRoom}
          >
            IDE 켜기
          </button>
        </div>
      )}
      <div id="editor"></div>
    </div>
  );
};

export default Editor;
