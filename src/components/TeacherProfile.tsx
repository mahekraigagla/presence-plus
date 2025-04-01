
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Calendar, BookOpen, MapPin } from 'lucide-react';

interface TeacherProfileProps {
  teacher: {
    id: string;
    name: string;
    email: string;
    department: string;
    subjects: string[];
    classesToday: number;
    nextClass?: {
      name: string;
      time: string;
      location: string;
    };
  };
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher }) => {
  return (
    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:w-1/3 bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-white/30">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=random`} />
                <AvatarFallback className="text-xl">
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{teacher.name}</h2>
                <p className="text-indigo-100 flex items-center justify-center mt-1">
                  <User className="h-4 w-4 mr-1.5" />
                  {teacher.email}
                </p>
                <p className="text-indigo-100 mt-1">Faculty ID: {teacher.id}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {teacher.subjects.map((subject, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-transparent"
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 md:w-2/3">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Daily Schedule</h3>
            <div className="mt-4 grid gap-4">
              <div className="flex items-center">
                <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/30">
                  <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                  <p className="font-medium">{teacher.department}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/30">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Classes Today</p>
                  <p className="font-medium">{teacher.classesToday} Classes</p>
                </div>
              </div>
              
              {teacher.nextClass && (
                <div className="flex items-center">
                  <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/30">
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next Class</p>
                    <p className="font-medium">{teacher.nextClass.name}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{teacher.nextClass.time}</span>
                      <MapPin className="h-3.5 w-3.5 ml-3 mr-1" />
                      <span>{teacher.nextClass.location}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherProfile;
