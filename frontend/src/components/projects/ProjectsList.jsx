import { useEffect, useState } from "react";
import axios from "axios";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/projects"
        );

        console.log("response", response);
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.repoId}
            className="p-4 bg-gray-900 rounded-lg border border-gray-800"
          >
            <h2 className="text-xl font-semibold">{project.projectName}</h2>
            <p className="text-gray-400">
              {project.repoName} ({project.branchName})
            </p>
            <a
              href={project.repoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400"
            >
              View Repository
            </a>
            <div className="mt-2">
              <p className="text-gray-400">Languages Used:</p>
              <ul>
                {project.detectedLanguages.map((lang, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>{lang.name}</span>
                    <div className="w-20 h-2 bg-gray-700 rounded">
                      <div
                        className="h-full bg-green-500 rounded"
                        style={{ width: `${lang.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{lang.percentage}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
