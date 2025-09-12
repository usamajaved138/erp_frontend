import axios from "axios";

const API_URL = "http://localhost:5000/api/delivery-challans";

// 🔹 Centralized error handler
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("API error:", error.response.data);
      throw new Error(
        error.response.data?.message || `API Error: ${error.response.status}`
      );
    } else if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("No response from server. Please check your connection.");
    }
  }
  console.error("Unexpected error:", error);
  throw new Error("Unexpected error occurred. Check console for details.");
};
// 🔹 Get All Delivery Challans
export const getDeliveryChallans = async () => {
  try {
    const res = await axios.post(API_URL, { operation: 1 });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};
// 🔹 Insert DC (with JSON items)
export const createDC = async (
    so_id:number,
  customer_id: number,
  dc_date: Date,
  
  warehouse_id: number,
  status: string,
  remarks: string,
  created_by: number,
  items: { item_id: number; quantity: number; unit_price: number; discount: number; tax: number }[]
) => {
  try {
    const res = await axios.post(API_URL, {
      operation: 2, // Assuming operation 2 is for insertion
      so_id,
      customer_id,
      dc_date,
      warehouse_id,
      status,
      remarks,
      created_by,
      items, // Convert array to JSON
    });

    // Backend expected: { success: true, so_id: 123, message: "SO created successfully" }
    return res.data.data ;
  } catch (error) {
    handleApiError(error);
  }
};