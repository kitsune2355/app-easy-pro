import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { dayJs } from "../config/dayJs";
import { IRepairSubmitForm } from "../interfaces/form/repairForm";

export const useRepairSubmitForm = () => {
  const { t } = useTranslation();
  const invalid = "FORM.REPAIR.RECIVED.VALIDATION";

  const schema: yup.ObjectSchema<IRepairSubmitForm> = yup.object().shape({
    id: yup.string().notRequired().default(""),
  });

  return useForm({
    defaultValues: schema.getDefault() as IRepairSubmitForm,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
};
