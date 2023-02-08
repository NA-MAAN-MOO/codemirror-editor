import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Editor from "./Editor";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <h1 className="m-10">모각코 메타버스 만세</h1>
      <Router>
        <Routes>
          <Route exact path="/" element={<Editor />} />
          <Route path="/:id" element={<Editor />} />
        </Routes>
      </Router>
    </div>
  );
}
