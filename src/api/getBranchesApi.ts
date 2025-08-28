import axios from "axios";

const API_URL = "http://localhost:5000/api/getBranches";

// Get all branches
export const getBranches = async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data; // [{ branch_id, branch_name }]
};