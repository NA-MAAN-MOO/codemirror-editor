import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Editor from './Editor';
import './App.css';

function App() {
  return (
    <div className="App">
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
