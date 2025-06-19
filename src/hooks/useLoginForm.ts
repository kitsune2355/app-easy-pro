import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import { ILoginForm } from '../interfaces/form/loginForm';
import * as yup from 'yup';

const schema: yup.ObjectSchema<ILoginForm> = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});
export const useLoginForm = () => {
  return useForm({
    defaultValues: schema.getDefault() as ILoginForm,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
};