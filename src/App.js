import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Editor from './Editor';
import './App.css';
import io from 'socket.io-client';
import DemoClient from './client/Client.Socket.io';

export const socket = io('http://localhost:8080');

function App() {
  return (
    <div className="App">
      {/* 소켓IO 데모 코드 */}
      <h1>Hello from Socket Demo</h1>
      <h2>Users List :</h2>
      <DemoClient />

      <h1 className="m-10">모각코 메타버스 IDE 테스트 中</h1>
      <BrowserRouter>
        <Routes>
          {/* 메인 페이지 -> Editor 컴포넌트 */}
          <Route exact path="/" element={<Editor />} />

          {/* 공동 편집창 -> Editor 컴포넌트 */}
          <Route path="/:id" element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
