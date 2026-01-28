import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import SiteHeader from "./components/SiteHeader";

import Homepage from "./pages/Homepage";
import ReviewDetails from "./pages/ReviewDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <SiteHeader />
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/details/:id" element={<ReviewDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
