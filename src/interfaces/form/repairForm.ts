export interface IRepairForm {
  report_date: string;
  report_time: string;
  name: string;
  phone: string;
  building: string;
  floor: string;
  room: string;
  desc: string;
  imgUrl?:File[] | string[];
}