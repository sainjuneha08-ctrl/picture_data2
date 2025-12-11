import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./element/Home";
import Create from "./element/Create";
import Edit from "./element/Edit";
import Read from "./element/Read";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/read/:id" element={<Read />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
