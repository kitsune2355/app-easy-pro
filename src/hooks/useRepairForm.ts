import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { IRepairForm } from '../interfaces/form/repairForm';

export const useRepairForm = () => {
  const { t } = useTranslation();
  const invalid = 'FORM.REPAIR.VALIDATION'

  const schema: yup.ObjectSchema<IRepairForm> = yup.object().shape({
    report_date: yup.string().required(t(`${invalid}.DATE`)),
    report_time: yup.string().required(t(`${invalid}.TIME`)),
    name: yup.string().required(t(`${invalid}.NAME`)),
    phone: yup.string().required(t(`${invalid}.PHONE`)),
    building: yup.string().required(t(`${invalid}.BUILDING`)),
    floor: yup.string().required(t(`${invalid}.FLOOR`)),
    room: yup.string().required(t(`${invalid}.ROOM`)),
    desc: yup.string().required(t(`${invalid}.DESCRIPTION`)),
    imgUrl: yup.string().notRequired()
  });

  return useForm({
    defaultValues: schema.getDefault() as IRepairForm,
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
};
