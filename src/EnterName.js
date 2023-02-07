import React, { useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useStore } from './store.js';
import axios from 'axios';

function EnterName() {
  const inputRef = useRef();
  const roomIdRef = useRef();
  const { setUsername, setRoomId } = useStore(({ setUsername, setRoomId }) => ({
    setUsername,
    setRoomId,
  }));

  const { mutateAsync } = useMutation(({ username, roomId, uri }) => {
    return axios.post(`http://localhost:3001/${uri}`, {
      username,
      roomId,
    });
  });

  /* 새로운 방 생성: GO 누르면 실행 될 함수 */
  const createRoom = async () => {
    const value = inputRef.current?.value;

    /* 유저네임 입력 에러처리 */
    if (!value) {
      alert('유저네임 입력하세요');

      return;
    }

    await mutateAsync(
      /* "Go!" request */
      { username: value, uri: 'create-room-with-user' },
      {
        // roomID return 받음
        onSuccess: ({ data }) => {
          setRoomId(data.roomId);
          alert('유저네임 생성 완료. 방 ID를 다른 사람에게 공유하세요');
        },
      }
    );
    setUsername(value); // username 생김 -> 리얼타임 에디터로 렌더링
  };

  /* 기존 방 참가: JOIN 누르면 실행될 함수 */
  const enterRoom = async () => {
    const nameInput = inputRef.current?.value;
    const roomIdValue = roomIdRef.current?.value;

    /* 입력 에러처리 */
    if (!nameInput || !roomIdValue) {
      alert('이름과 방 ID 입력해주세요');
      return;
    }
    setRoomId(roomIdValue);
    setUsername(nameInput);
  };

  return (
    <>
      <div>
        <input
          pr="4.5rem"
          size="lg"
          placeholder="Enter your name"
          ref={inputRef}
        />
        <button size="lg" onClick={createRoom}></button>
        {/* <button size="lg">Go!</button> */}
      </div>
      <div>
        <input
          pr="4.5rem"
          size="lg"
          placeholder="Enter a room id"
          ref={roomIdRef}
        />
        <button size="lg" onClick={enterRoom}></button>
        {/* <button size="lg">Join!</button> */}
      </div>
    </>
  );
}

export default EnterName;
