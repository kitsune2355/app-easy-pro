import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { IRepairForm } from "../interfaces/form/repairForm";
import { dayJs } from "../config/dayJs";

export const useRepairForm = () => {
  const { t } = useTranslation();
  const invalid = "FORM.REPAIR.VALIDATION";

  const schema: yup.ObjectSchema<IRepairForm> = yup.object().shape({
    report_date: yup
      .string()
      .required(t(`${invalid}.DATE`))
      .default(dayJs().format("YYYY-MM-DD")),
    report_time: yup
      .string()
      .required(t(`${invalid}.TIME`))
      .default(dayJs().format("HH:mm")),
    name: yup
      .string()
      .required(t(`${invalid}.NAME`))
      .default(""),
    phone: yup
      .string()
      .required(t(`${invalid}.PHONE`))
      .length(10, t(`${invalid}.PHONE_LENGTH`))
      .default(""),
    building: yup
      .string()
      .required(t(`${invalid}.BUILDING`))
      .default(""),
    floor: yup.string().notRequired().default(""),
    room: yup.string().notRequired().default(""),
    desc: yup
      .string()
      .required(t(`${invalid}.DESCRIPTION`))
      .default(""),
    image_url: yup
      .array()
      .of(yup.string())
      .nullable()
      .notRequired()
      .default(undefined),
  });

  return useForm({
    defaultValues: schema.getDefault() as IRepairForm,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
};
