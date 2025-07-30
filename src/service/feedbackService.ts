import axios from "axios";
import { AppDispatch } from "../store";
import { env } from "../config/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateHasFeedback } from "../redux/repairSlice";

export interface IFeedbackForm {
  repair_id: number;
  rating: number;
  comments?: string;
  create_by?: string;
}

export interface IFeedbackResponse {
  status: "success" | "error";
  message: string;
}

export const submitFeedback =
  (form: IFeedbackForm) =>
  async (dispatch: AppDispatch): Promise<IFeedbackResponse> => {
    try {
      // Get user info from AsyncStorage
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const user = userInfoString ? JSON.parse(userInfoString) : null;

      const requestData = {
        repair_id: form.repair_id,
        rating: form.rating,
        comments: form.comments || "",
        create_by: form.create_by || user?.name || user?.id || "anonymous",
      };

      const response = await axios.post(
        `${env.API_ENDPOINT}/submit_feedback.php`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result.status === "success") {
        dispatch(updateHasFeedback(1));

        return {
          status: "success",
          message: result.message,
        };
      } else {
        return {
          status: "error",
          message: result.message,
        };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Network error occurred while submitting feedback";

      return {
        status: "error",
        message: errorMessage,
      };
    }
  };
