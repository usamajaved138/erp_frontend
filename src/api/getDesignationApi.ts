import axios from "axios";

const API_URL = "http://localhost:5000/api/getdesignations";

export const getDesignations = async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};
