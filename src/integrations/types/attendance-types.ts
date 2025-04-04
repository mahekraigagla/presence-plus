
export interface AttendanceStatsProps {
  studentId: string;
}

export interface AttendanceTableProps {
  studentId: string;
}

export interface StudentData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  roll_number: string;
  department: string;
  year: string;
  face_image?: string;
  face_registered?: boolean;
  created_at: string;
  updated_at: string;
}
