import { IUser } from "./user.interface";

export interface IRepair {
  id?: string;
  report_date: string;
  report_time: string;
  name: string;
  phone: string;
  building: string;
  floor: string;
  room: string;
  problem_detail: string;
  image_url?: File[] | string[];
  created_at?: string;
  created_by?: IUser;
  status: string;
  received_date?: string;
  received_by?: IUser;
  received_by_tel?: string;
  process_date?: string;
  process_time?: string;
  completed_date?: string;
  completed_time?: string;
  completed_solution?: string;
  completed_image_urls?: File[] | string[];
}

export interface IServiceType {
  rpg_id: string;
  rpg_name: string;
}

export interface IJobType {
  rps_id: string;
  rps_name: string;
}