import axios from "axios";

const API_URL = "http://localhost:5000/api/getvendors";

export const getVendors = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw error;
  }
};
