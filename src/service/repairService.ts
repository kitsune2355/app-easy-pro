import axios from 'axios';
import { setRepairs, setLoading, setError, setRepairDetail } from '../redux/repairSlice';
import { AppDispatch } from '../store';
import { env } from '../config/environment';
import { IRepairForm } from '../interfaces/form/repairForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAreaStructure } from '../redux/areaSlice';

export const fetchAllRepairs = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${env.API_ENDPOINT}/get_all_repair.php`);
    dispatch(setRepairs(response.data.data));
  } catch (error) {
    dispatch(setError('Failed to fetch repairs'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchRepairById = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${env.API_ENDPOINT}/get_repair_by_id.php?id=${id}`);
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
    const response = await axios.get(`${env.API_ENDPOINT}/get_all_building.php`);
    
    if (response.data && response.data.building) {
      dispatch(setAreaStructure(response.data.building));
    } else {
      dispatch(setError('ไม่พบข้อมูลอาคาร'));
    }
  } catch (error: any) {
    dispatch(setError(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลอาคาร'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const submitRepairForm = (form: IRepairForm) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  
  try {
    const userInfoString = await AsyncStorage.getItem('userInfo');
    const user = userInfoString ? JSON.parse(userInfoString) : null;
    
    if (!user || !user.id) {
      throw new Error('User information not found');
    }

    const formData = new FormData();
    formData.append('reportDate', form.report_date);
    formData.append('reportTime', form.report_time);
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    formData.append('building', form.building);
    formData.append('floor', form.floor);
    formData.append('room', form.room);
    formData.append('problemDetail', form.desc);
    formData.append('createdBy', user.id);

    const imgUrlsArray = Array.isArray(form.imgUrl) ? form.imgUrl : (form.imgUrl ? [form.imgUrl] : []);

    for (const uri of imgUrlsArray) {
      if (typeof uri === 'string') {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('image[]', {
          uri: uri,
          name: filename,
          type: type,
        } as any);
      } else {
        formData.append('image[]', uri);
      }
    }

    const response = await axios.post(`${env.API_ENDPOINT}/submit_repair.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const res = response.data;

    if (res.status === 'success') {
      dispatch(fetchAllRepairs());
      return res;
    } else {
      dispatch(setError(res.message || 'Failed to submit repair'));
      throw new Error(res.message || 'Failed to submit repair');
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Something went wrong during repair submission.';
    dispatch(setError(errorMessage));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

