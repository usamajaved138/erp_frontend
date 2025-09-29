import axios from "axios";

const API_URL = "http://localhost:5000/api/getAuditLogs";

// Get all branches
export const getAuditDetail = async () => {
  const res = await axios.get(API_URL);
  return res.data; 
};