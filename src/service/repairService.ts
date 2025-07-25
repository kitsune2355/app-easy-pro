import axios from "axios";
import {
  setRepairs,
  setLoading,
  setError,
  setRepairDetail,
  setServiceType,
  setJobType,
} from "../redux/repairSlice";
import { AppDispatch } from "../store";
import { env } from "../config/environment";
import {
  ICompleteRepairForm,
  IRepairForm,
} from "../interfaces/form/repairForm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAreaStructure } from "../redux/areaSlice";

export const fetchAllRepairs = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const userInfoString = await AsyncStorage.getItem("userInfo");
    const user = userInfoString ? JSON.parse(userInfoString) : null;

    if (!user || !user.id) {
      throw new Error("User information not found");
    }
    const response = await axios.get(`${env.API_ENDPOINT}/get_all_repair.php`, {
      params: { user_id: user.id, ag_id: user.agency },
    });
    dispatch(setRepairs(response.data.data));
  } catch (error) {
    dispatch(setError("Failed to fetch repairs"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchRepairById =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${env.API_ENDPOINT}/get_repair_by_id.php?id=${id}`
      );
      if (response.data.status === "success") {
        dispatch(setRepairDetail(response.data.data));
      } else {
        dispatch(setError(response.data.message || "ไม่พบข้อมูล"));
      }
    } catch (error: any) {
      dispatch(setError(error.message || "เกิดข้อผิดพลาด"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchAllAreas = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await axios.get(
      `${env.API_ENDPOINT}/get_all_building.php`
    );

    if (response.data && response.data.building) {
      dispatch(setAreaStructure(response.data.building));
    } else {
      dispatch(setError("ไม่พบข้อมูลอาคาร"));
    }
  } catch (error: any) {
    dispatch(setError(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลอาคาร"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const submitRepairForm =
  (form: IRepairForm) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const user = userInfoString ? JSON.parse(userInfoString) : null;

      if (!user || !user.id) {
        throw new Error("User information not found");
      }

      const formData = new FormData();
      formData.append("reportDate", form.report_date);
      formData.append("reportTime", form.report_time);
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("building", form.building);
      formData.append("floor", form.floor);
      formData.append("room", form.room);
      formData.append("problemDetail", form.desc);
      formData.append("createdBy", user.id);
      formData.append("ag_id", user.agency);

      const image_urlsArray = Array.isArray(form.image_url)
        ? form.image_url
        : form.image_url
        ? [form.image_url]
        : [];

      for (const uri of image_urlsArray) {
        if (typeof uri === "string") {
          const filename = uri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename || "");
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          formData.append("image[]", {
            uri: uri,
            name: filename,
            type: type,
          } as any);
        } else {
          formData.append("image[]", uri);
        }
      }

      const response = await axios.post(
        `${env.API_ENDPOINT}/submit_repair.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const res = response.data;

      if (res.status === "success") {
        dispatch(fetchAllRepairs());
        return res;
      } else {
        dispatch(setError(res.message));
        throw new Error(res.message);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong during repair submission.";
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateRepairStatus =
  (id: string, status: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const user = userInfoString ? JSON.parse(userInfoString) : null;

      if (!user || !user.id) {
        throw new Error("User information not found");
      }
      const response = await axios.post(
        `${env.API_ENDPOINT}/update_repair_by_id.php`,
        {
          id,
          status,
          received_by: user.id,
        }
      );

      if (response.data.status === "success") {
        dispatch(fetchRepairById(id));
        return response.data;
      } else {
        dispatch(
          setError(response.data.message || "Failed to update repair status")
        );
        throw new Error(
          response.data.message || "Failed to update repair status"
        );
      }
    } catch (error: any) {
      dispatch(setError(error.message || "เกิดข้อผิดพลาด"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateRepairProcessDate =
  (id: string, processDate: string, processTime: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await axios.post(
        `${env.API_ENDPOINT}/update_repair_by_id.php`,
        {
          id,
          process_date: processDate,
          process_time: processTime,
        }
      );

      if (response.data.status === "success") {
        dispatch(fetchRepairById(id));
        return response.data;
      } else {
        dispatch(
          setError(
            response.data.message || "Failed to update repair process date"
          )
        );
        return {
          status: "error",
          message:
            response.data.message || "Failed to update repair process date",
        };
      }
    } catch (error: any) {
      dispatch(setError(error.message || "เกิดข้อผิดพลาด"));
      return { status: "error", message: error.message || "เกิดข้อผิดพลาด" };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const completeRepair =
  (form: ICompleteRepairForm) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("repair_request_id", form.repair_request_id);
      formData.append("completed_solution", form.completed_solution);
      formData.append("completed_by", form.completed_by);
      formData.append("service_type", form.service_type);
      formData.append("job_type", form.job_type);

      // Append completed images
      const completed_image_urlsArray = Array.isArray(form.completed_image_urls)
        ? form.completed_image_urls
        : form.completed_image_urls
        ? [form.completed_image_urls]
        : [];

      for (const uri of completed_image_urlsArray) {
        if (typeof uri === "string") {
          const filename = uri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename || "");
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          formData.append("completed_image[]", {
            uri: uri,
            name: filename,
            type: type,
          } as any);
        } else {
          formData.append("completed_image[]", uri);
        }
      }

      const response = await axios.post(
        `${env.API_ENDPOINT}/submit_repair_completed.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const res = response.data;

      if (res.status === "success") {
        dispatch(fetchRepairById(form.repair_request_id));
        return res;
      } else {
        dispatch(setError(res.message || "Failed to complete repair"));
        throw new Error(res.message || "Failed to complete repair");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong during repair completion.";
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchAllServiceType = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${env.API_ENDPOINT}/get_all_service_type.php`);
    dispatch(setServiceType(response.data.service_type));
  } catch (error) {
    dispatch(setError("Failed to fetch service types"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchAllJobType = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${env.API_ENDPOINT}/get_all_job_type.php`);
    dispatch(setJobType(response.data.job_type));
  } catch (error) {
    dispatch(setError("Failed to fetch job types"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchServiceTypeById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${env.API_ENDPOINT}/get_all_service_type.php?id=${id}`);
    dispatch(setServiceType(response.data.service_type));
  } catch (error) {
    dispatch(setError("Failed to fetch service type"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchJobTypeById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${env.API_ENDPOINT}/get_all_job_type.php?id=${id}`);
    dispatch(setJobType(response.data.job_type));
  } catch (error) {
    dispatch(setError("Failed to fetch job type"));
  } finally {
    dispatch(setLoading(false));
  }
};