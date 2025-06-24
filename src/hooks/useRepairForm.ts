import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IRepairForm } from '../interfaces/form/repairForm';

const schema: yup.ObjectSchema<IRepairForm> = yup.object().shape({
  report_date: yup.string().required('Report date is required'),
  report_time: yup.string().required('Report time is required'),
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
  building: yup.string().required('Building is required'),
  floor: yup.string().required('Floor is required'),
  room: yup.string().required('Room is required'),
  desc: yup.string().required('Description is required'),
  imgUrl: yup.string().required('Image URL is required'),
});
export const useRepairForm = () => {
  return useForm({
    defaultValues: schema.getDefault() as IRepairForm,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
};