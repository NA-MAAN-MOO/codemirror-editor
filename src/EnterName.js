import React, { useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { useStore } from './store.js';
import axios from 'axios';

function EnterName() {
  const inputRef = useRef();
  const roomIdRef = useRef();
  // // const toast = useToast(); // ui 문제
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

    /* ui 문제 */
    // if (!value) {
    //   toast({
    //     title: 'Please enter your username',
    //     status: 'error',
    //     duration: 9000,
    //     isClosable: true,
    //   });
    //   return;
    // }
    await mutateAsync(
      /* "Go!" request */
      { username: value, uri: 'create-room-with-user' },
      {
        // roomID return 받음
        onSuccess: ({ data }) => {
          setRoomId(data.roomId);
          /* ui 문제 */
          // toast({
          //   title: 'We created your username, you will find yourself in a room',
          //   description: 'Share the room id with anyone',
          //   status: 'success',
          //   duration: 9000,
          //   isClosable: true,
          // });
        },
      }
    );
    setUsername(value); // username 생김 -> 리얼타임 에디터로 렌더링
  };

  /* 기존 방 참가: JOIN 누르면 실행될 함수 */
  const enterRoom = async () => {
    const value = inputRef.current?.value;
    const roomIdValue = roomIdRef.current?.value;

    if (!value || !roomIdValue) {
      /* ui 문제 */
      // toast({
      //   title: 'Please enter text in both inputs',
      //   status: 'error',
      //   duration: 9000,
      //   isClosable: true,
      // });
      return;
    }
    setRoomId(roomIdValue);
    setUsername(value);
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
        {/* <button size="lg" onClick={createRoom}> */}
        <button size="lg">Go!</button>
      </div>
      <div>
        <input
          pr="4.5rem"
          size="lg"
          placeholder="Enter a room id"
          ref={roomIdRef}
        />
        {/* <button size="lg" onClick={enterRoom}> */}
        <button size="lg">Join!</button>
      </div>
    </>
  );
}

export default EnterName;
