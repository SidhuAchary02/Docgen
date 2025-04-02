import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/auth/Signup"
import Repos from "./components/projects/Repos";
import NewProject from "./components/projects/NewProject";
import ProjectsList from "./components/projects/ProjectsList";
import SuccessPage from "./SuccessPage";
import PreviewPage from "./PreviewPage";
import Home from './Home'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/repos" element={<Repos />} />
      <Route path="/new-project" element={<NewProject />} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/preview" element={<PreviewPage />} />
    </Routes>
  );
};

export default App;