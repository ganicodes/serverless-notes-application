import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModeToggle } from "./components/mode-toggle";
import LandingPage from "./pages/LandingPage";
import Notes from "./pages/Notes";
import Signin from "./pages/Signin";
import { Signup } from "./pages/Signup";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="container">
          <ModeToggle />
        </div>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
