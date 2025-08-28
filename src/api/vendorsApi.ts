import axios from "axios";

const API_URL = "http://localhost:5000/api/vendors";

//  Centralized error handler
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

//  Get Vendors
export const getVendors = async () => {
  try {
    const res = await axios.post(API_URL, { operation: 1 });
   console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//  Add Vendor
export const addVendor = async (
  
  vendor_name: string,
  
  phone: string,
  email: string,
  address: string,
  account_id: number
) => {
  try {
    const res = await axios.post(API_URL, {
      operation: 2,
      
      vendor_name,
     
      phone,
      email,
      address,
      account_id
    });
    // Backend returns: { success: true, message: "Vendor added successfully" }
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

// 🔹 Update Vendor
export const updateVendor = async (
  vendor_id: number,
  vendor_name: string,

  phone: string,
  email: string,
  address: string,
  account_id: number
) => {
  try {
    const res = await axios.post(API_URL, {
      operation: 3,
      vendor_id,
      vendor_name,
      
      phone,
      email,
      address,
      account_id
    });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

//  Delete Vendor
export const deleteVendor = async (vendor_id: number) => {
  try {
    const res = await axios.post(API_URL, {
      operation: 4,
      vendor_id,
    });
    return res.data ; 
  } catch (error) {
    handleApiError(error);
  }
};
