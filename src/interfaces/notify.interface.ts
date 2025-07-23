export interface INotification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  desc?: string;
  building?: string;
  floor?: string;
  room?: string;
  related_id: number | null;
  is_read: boolean;
  image_url?: string;
  created_by?: string;
  created_at: string;
}

export interface IFetchNotificationsResponse {
  success: boolean;
  data: INotification[];
  unreadCount: number;
}

export interface IMarkReadResponse {
  success: boolean;
  message: string;
}