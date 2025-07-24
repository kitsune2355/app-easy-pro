export interface IAgency {
  ag_id: number;
  ag_area: string;
  ag_contract: string;
  ag_cpb_groupanswer: number;
  ag_details: string;
  ag_ins: string;
  ag_job: string;
  ag_located: string;
  ag_op: string;
  ag_status: number;
  ag_user_id: string;
  ag_username: string;
}

export interface IUser {
  user_id: string;
  user_name: string;
  user_fname?: string;
  user_tel: string;
  user_level: string;
  user_department_name: string;
  agency: IAgency;
}