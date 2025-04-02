import axios from "axios";

// Function to fetch user repositories
export const fetchUserRepositories = async (accessToken) => {
  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        visibility: "all",
        affiliation: "owner",
        per_page: 100,
        page: 1,
      },
    });
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
};
