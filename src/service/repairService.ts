import axios from 'axios';
import { setRepairs, setLoading, setError } from '../redux/repairSlice';
import { AppDispatch } from '../store';

const baseUrl = 'https://happylandgroup.biz/API_es'

export const fetchRepairs = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${baseUrl}/get_all_repair.php`);
    dispatch(setRepairs(response.data.data)); 
  } catch (error) {
    dispatch(setError('Failed to fetch repairs'));
  } finally {
    dispatch(setLoading(false));
  }
};
