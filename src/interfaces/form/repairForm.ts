export interface IRepairForm {
  report_date: string;
  report_time: string;
  name: string;
  phone: string;
  building: string;
  floor: string;
  room: string;
  desc: string;
  image_url?: File[] | string[];
}

export interface IRepairProcessForm {
  process_date: string;
}

export interface IRepairSubmitForm {
  id: string;
}
