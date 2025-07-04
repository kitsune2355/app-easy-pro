import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { dayJs } from '../config/dayJs';

interface IRepairProcessForm {
  process_date: string;
}

export const useRepairProcessForm = () => {
  const { t } = useTranslation();
  const invalid = 'FORM.REPAIR.RECIVED.VALIDATION'

  const schema: yup.ObjectSchema<IRepairProcessForm> = yup.object().shape({
    process_date:  yup.string().notRequired().default(dayJs().format('YYYY-MM-DD')),
  });

  return useForm({
    defaultValues: schema.getDefault() as IRepairProcessForm,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
};