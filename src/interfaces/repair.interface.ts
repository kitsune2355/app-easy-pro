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
  created_by?: string;
  status: string;
  received_date?: string;
  received_by?: string;
  received_by_tel?: string;
  process_date?: string;
}
