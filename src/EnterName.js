import React, { useRef } from 'react';
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import axios from 'axios';
import { useStore } from './store.js';

function EnterName() {
  const inputRef = useRef();
  const roomIdRef = useRef();

  /* state 디스트럭쳐링 */
  const { setUsername, setRoomId } = useStore(({ setUsername, setRoomId }) => ({
    setUsername,
    setRoomId,
  }));

  console.log('state 디스트럭쳐링 성공');

  /* 뮤테이션 인자로 넘겨진 post 요청이 mutateAsync가 호출되면 실행 됨 */
  // const { mutateAsync } = useMutation(({ username, roomId, uri }) => {
  //   return axios.post(`http://localhost:3001/${uri}`, {
  //     username,
  //     roomId,
  //   });
  // });

  console.log('mutation 성공');

  /* 새로운 방 생성: GO 누르면 실행 될 함수 */
  const createRoom = async () => {
    const nameInputValue = inputRef.current?.value;

    /* 유저네임 입력 에러처리 */
    if (!nameInputValue) {
      alert('유저네임 입력하세요');
      return;
    }

    try {
      /* "Go!" request */
      const { data } = await axios.post(
        `http://localhost:3001/create-room-with-user`,
        {
          username: nameInputValue,
        }
      );

      setRoomId(data.roomId);
      setUsername(nameInputValue);

      console.log(`onSuccess! 방 ID는 : ${data.roomId}`);
      alert('유저네임 생성 완료. 방 ID를 다른 사람에게 공유하세요');
    } catch (error) {
      console.error(error);
      alert('생성 실패');
    }

    //   /* "Go!" request */
    //   await mutateAsync(
    //     { username: nameInputValue, uri: 'create-room-with-user' },
    //     {
    //       // 서버로부터 roomID return 받음
    //       onSuccess: ({ data }) => {
    //         setRoomId(data.roomId);
    //         console.log(`onSuccess! 방 ID는 : ${data.roomId}`);
    //         alert('유저네임 생성 완료. 방 ID를 다른 사람에게 공유하세요');
    //       },
    //     }
    //   );
    //   setUsername(nameInputValue); // username 생김 -> 리얼타임 에디터로 렌더링
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
        <button size="lg" onClick={createRoom}>
          Go!
        </button>
        {/* <button size="lg">Go!</button> */}
      </div>
      <div>
        <input
          pr="4.5rem"
          size="lg"
          placeholder="Enter a room id"
          ref={roomIdRef}
        />
        <button size="lg" onClick={enterRoom}>
          Join!
        </button>
        {/* <button size="lg">Join!</button> */}
      </div>
    </>
  );
}

export default EnterName;
