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
  process_time: string;
}

export interface IRepairSubmitForm {
  service_type: string;
  job_type: string;
  solution: string;
}

export interface ICompleteRepairForm {
  repair_request_id: string;
  completed_solution: string;
  service_type: string;
  job_type: string;
  completed_by: string;
  completed_image_urls?: string[];
}