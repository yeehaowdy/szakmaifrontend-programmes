import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Programmes from "./pages/Programmes";
import SearchResult from "./pages/SearchResult";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programmes/:id" element={<Programmes />} />
        <Route path="/search/:searchedWord" element={<SearchResult />} />
      </Routes>
    </BrowserRouter>
  );
}