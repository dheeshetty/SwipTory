import "./App.css";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import AddStory from "./component/Story/addstory";
import Bookmark from "./component/Bookmark/bookmark";
import EditStory from "./component/Editstory/Editstory";
import Homepage from "./pages/Homepage";
import StoryPage from "./pages/Storypage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import NotFound from "./component/Notfound/notfound";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/story/:id" element={<StoryPage />} />
        <Route path="/addstory" element={<AddStory />} />
        <Route path="/editstory/:id" element={<EditStory />} />
        <Route path="/bookmarked" element={<Bookmark />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
