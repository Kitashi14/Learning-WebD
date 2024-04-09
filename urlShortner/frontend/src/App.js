/** @format */

import OpenUrl from "./components/OpenUrl";
import Form from "./components/form";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/homepage";

function App() {
  return (
    <>
      <Routes>

        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/create" element={<Form />} />
        <Route exact path="/url/:id" element={<OpenUrl />} />
      </Routes>
    </>
  );
}

export default App;
