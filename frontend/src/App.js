import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          {/* Các route khác */}
        </Routes>
      </Router>
  );
}

export default App;

