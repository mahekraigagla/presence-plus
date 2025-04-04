import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceStatsProps } from '@/components/ui/attendance-types';

// Sample data for demonstration
const weeklyData = [
  { day: 'Mon', attended: 2, total: 3 },
  { day: 'Tue', attended: 3, total: 3 },
  { day: 'Wed', attended: 1, total: 2 },
  { day: 'Thu', attended: 2, total: 2 },
  { day: 'Fri', attended: 2, total: 3 },
];

const monthlyData = [
  { week: 'Week 1', attended: 9, total: 12 },
  { week: 'Week 2', attended: 7, total: 10 },
  { week: 'Week 3', attended: 11, total: 12 },
  { week: 'Week 4', attended: 9, total: 10 },
];

const semesterData = [
  { month: 'Jan', attended: 35, total: 40 },
  { month: 'Feb', attended: 38, total: 45 },
  { month: 'Mar', attended: 30, total: 42 },
  { month: 'Apr', attended: 28, total: 35 },
  { month: 'May', attended: 32, total: 38 },
];

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ studentId, className }) => {
  // Format data for percentage calculation
  const formatDataForChart = (data: any[]) => {
    return data.map(item => {
      const keyName = Object.keys(item)[0]; // Get the first key (day, week, month)
      return {
        ...item,
        percentage: Math.round((item.attended / item.total) * 100)
      };
    });
  };

  const formattedWeeklyData = formatDataForChart(weeklyData);
  const formattedMonthlyData = formatDataForChart(monthlyData);
  const formattedSemesterData = formatDataForChart(semesterData);
  
  // Calculate overall attendance percentage
  const calculateOverall = (data: any[]) => {
    const totalAttended = data.reduce((sum, item) => sum + item.attended, 0);
    const totalClasses = data.reduce((sum, item) => sum + item.total, 0);
    return {
      attended: totalAttended,
      total: totalClasses,
      percentage: Math.round((totalAttended / totalClasses) * 100)
    };
  };
  
  const weeklyOverall = calculateOverall(weeklyData);
  const monthlyOverall = calculateOverall(monthlyData);
  const semesterOverall = calculateOverall(semesterData);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass dark:glass-dark p-3 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Attended: <span className="font-medium text-primary">{payload[0].payload.attended}/{payload[0].payload.total}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-medium text-primary">{payload[0].payload.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`glass dark:glass-dark shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl">Your Attendance</CardTitle>
        <CardDescription>
          Track your attendance records and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="semester">Semester</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="pt-4">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedWeeklyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="percentage" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Classes Attended</p>
                <p className="text-2xl font-semibold">{weeklyOverall.attended}/{weeklyOverall.total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Overall Percentage</p>
                <p className={`text-2xl font-semibold ${weeklyOverall.percentage >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                  {weeklyOverall.percentage}%
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="pt-4">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="week" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="percentage" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Classes Attended</p>
                <p className="text-2xl font-semibold">{monthlyOverall.attended}/{monthlyOverall.total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Overall Percentage</p>
                <p className={`text-2xl font-semibold ${monthlyOverall.percentage >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                  {monthlyOverall.percentage}%
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="semester" className="pt-4">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedSemesterData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="percentage" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Classes Attended</p>
                <p className="text-2xl font-semibold">{semesterOverall.attended}/{semesterOverall.total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Overall Percentage</p>
                <p className={`text-2xl font-semibold ${semesterOverall.percentage >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                  {semesterOverall.percentage}%
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Minimum required attendance: 75%
      </CardFooter>
    </Card>
  );
};

export default AttendanceStats;
