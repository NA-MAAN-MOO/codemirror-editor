const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
const io = new Server(server); // 서버
const { createClient } = require('redis');
const { v4 } = require('uuid');
const moment = require('moment');
const { json } = require('body-parser');

const { blueBright, greenBright, redBright, yellowBright } = require('chalk');

const client = createClient();
app.use(json());
app.use(cors());

client.on('error', console.error);

/* default client configuration */
client
  .connect()
  .then(() => console.log(blueBright.bold('Connected to redis locally!')))
  .catch(() => {
    console.error(redBright.bold('Error connecting to redis'));
  });

app.get('/', (req, res) => {
  res.send({ msg: 'hi' });
});

/* "Go!"를 누르면 보내는 응답 */
app.post('/create-room-with-user', async (req, res) => {
  const { username } = req.body;
  const roomId = v4();

  await client
    /* roomID 해쉬로 저장 */
    .hSet(`${roomId}:info`, {
      created: moment(),
      updated: moment(),
      // code: '에디터에 "현재" 저장된 코드가 들어갈 곳, 새 유저가 들어오면 이거 추출해서 리턴'
    })
    .catch((err) => {
      console.error(1, err);
    });

  // await client.lSet(`${roomId}:users`, [])

  res.status(201).send({ roomId }); // return the room ID
});

/* 소켓이 연결되면 실행할 코드들(이벤트 리스너 방식)
io: 연결된 모든 소켓
socket: 특정한 소켓 */
io.on('connection', (socket) => {
  console.log(yellowBright.bold(`새로운 유저: ${socket.id}`));

  socket.on('CODE_CHANGED', async (code) => {
    const { roomId, username } = await client.hGetAll(socket.id); // 해당 소켓아이디로 방ID, 유저네임 알아냄
    const roomName = `ROOM:${roomId}`;
    // io.emit('CODE_CHANGED', code)
    socket.to(roomName).emit('CODE_CHANGED', code); // "코드변경" 이벤트 다른 소켓들에게 알림
  });

  socket.on('DISSCONNECT_FROM_ROOM', async ({ roomId, username }) => {});

  // "방 연결" 받으면 실행할 코드
  socket.on('CONNECTED_TO_ROOM', async ({ roomId, username }) => {
    await client.lPush(`${roomId}:users`, `${username}`);
    await client.hSet(socket.id, { roomId, username }); // 해쉬셋; key_socket.id , data_방id, 유저네임
    const users = await client.lRange(`${roomId}:users`, 0, -1);
    const roomName = `ROOM:${roomId}`; // 방 이름
    socket.join(roomName);
    io.in(roomName).emit('ROOM:CONNECTION', users); // 방의 모든 유저에게 "방 연결" 알림 + 유저 리스트 알림
  });

  /* 방 연결이 해제되면 발생할 일  */
  socket.on('disconnect', async () => {
    // TODO if 2 users have the same name

    // 해쉬에 저장된거 디스트럭쳐링 (소켓 아이디로, 룸ID,유저네임 알아냄)
    const { roomId, username } = await client.hGetAll(socket.id);

    // 방금 나간 유저 식별해서 유저리스트에서 제거하기
    const users = await client.lRange(`${roomId}:users`, 0, -1);
    const newUsers = users.filter((user) => username !== user);

    // 유저들이 하나라도 존재하면 방금 나간 유저 완전히 지우기
    if (newUsers.length) {
      await client.del(`${roomId}:users`);
      await client.lPush(`${roomId}:users`, newUsers);
    } else {
      await client.del(`${roomId}:users`);
    }

    // 방에 있던 사람들에게 새로운 유저 리스트 전달
    const roomName = `ROOM:${roomId}`;
    io.in(roomName).emit('ROOM:CONNECTION', newUsers);
  });
});

/* 서버 포트 */
server.listen(3001, () => {
  console.log(greenBright.bold('listening on *:3001'));
});
