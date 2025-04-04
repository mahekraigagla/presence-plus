
export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  lecture_id: string;
  timestamp: string;
  status: 'Present' | 'Absent' | 'Late';
  verification_method?: string;
  student_name?: string;
}

export interface AttendanceStatsProps {
  studentId?: string;
  role?: string;
  className?: string;
}

export interface AttendanceTableProps {
  studentId?: string;
  classId?: string;
  date?: string;
}
