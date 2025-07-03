import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { dayJs } from '../config/dayJs';
import { IRepairProcessForm } from '../interfaces/form/repairForm';

export const useRepairProcessForm = () => {
  const { t } = useTranslation();
  const invalid = 'FORM.REPAIR.RECIVED.VALIDATION'

  const schema: yup.ObjectSchema<IRepairProcessForm> = yup.object().shape({
    process_date:  yup.string().required().default(dayJs().format('YYYY-MM-DD')),
    process_time: yup.string().required().default(dayJs().format('HH:mm')),
  });

  return useForm({
    defaultValues: schema.getDefault() as IRepairProcessForm,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
};