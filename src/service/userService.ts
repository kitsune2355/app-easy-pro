import axios from "axios";
import {
  setLoading,
  setError,
  setUserDetail,
  clearError,
} from "../redux/userSlice";
import { AppDispatch } from "../store";
import { env } from "../config/environment";

// Get user by ID
export const fetchUserById = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());

    const response = await axios.get(
      `${env.API_ENDPOINT}/get_user_by_id.php?id=${id}`
    );

    if (response.data.status === "success") {
      dispatch(setUserDetail(response.data.user));
      return { status: "success", data: response.data.user };
    } else {
      const errorMessage = response.data.message || "ไม่พบข้อมูลผู้ใช้";
      dispatch(setError(errorMessage));
      return { status: "error", message: errorMessage };
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้";
    dispatch(setError(errorMessage));
    return { status: "error", message: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};


// Get current user profile
// export const fetchCurrentUser = () => async (dispatch: AppDispatch) => {
//   try {
//     dispatch(setLoading(true));
//     dispatch(clearError());

//     const response = await axios.get(`${env.API_ENDPOINT}/get_current_user.php`);

//     if (response.data.status === "success") {
//       dispatch(setUser(response.data.data));
//       return { status: "success", data: response.data.data };
//     } else {
//       const errorMessage = response.data.message || "ไม่พบข้อมูลผู้ใช้";
//       dispatch(setError(errorMessage));
//       return { status: "error", message: errorMessage };
//     }
//   } catch (error: any) {
//     const errorMessage = error.response?.data?.message || error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้";
//     dispatch(setError(errorMessage));
//     return { status: "error", message: errorMessage };
//   } finally {
//     dispatch(setLoading(false));
//   }
// };
