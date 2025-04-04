import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, Clock, User2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
});

const AttendancePage = () => {
  const [classInfo, setClassInfo] = useState<{ id: string; name: string } | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { classId } = useParams<{ classId: string }>();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  useEffect(() => {
    if (!classId) {
      toast({
        title: "Error",
        description: "Class ID is missing.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const fetchClassInfo = async () => {
      try {
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('id, name')
          .eq('id', classId)
          .single();

        if (classError) {
          console.error("Error fetching class info:", classError);
          throw classError;
        }

        if (classData) {
          setClassInfo({ id: classData.id, name: classData.name });
        } else {
          toast({
            title: "Error",
            description: "Class not found.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching class info:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load class information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassInfo();
  }, [classId, toast]);

  const fetchAttendanceData = async (selectedDate: Date) => {
    if (!classId) return;

    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('attendances')
        .select(`
          id,
          status,
          student_id,
          students (
            id,
            full_name,
            roll_number
          )
        `)
        .eq('class_id', classId)
        .eq('date', formattedDate);

      if (error) {
        console.error("Error fetching attendance data:", error);
        throw error;
      }

      if (data) {
        setAttendanceData(data);
      } else {
        setAttendanceData([]);
      }
    } catch (error: any) {
      console.error("Error fetching attendance data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load attendance data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = form.getValues().date;
    fetchAttendanceData(currentDate);
  }, [classId, toast]);

  const updateAttendanceStatus = async (attendanceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('attendances')
        .update({ status: newStatus })
        .eq('id', attendanceId);

      if (error) {
        console.error("Error updating attendance status:", error);
        throw error;
      }

      // Optimistically update the state
      setAttendanceData(prevData =>
        prevData.map(item =>
          item.id === attendanceId ? { ...item, status: newStatus } : item
        )
      );

      toast({
        title: "Success",
        description: "Attendance status updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating attendance status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update attendance status.",
        variant: "destructive",
      });
      // Revert the state in case of error
      fetchAttendanceData(form.getValues().date);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setProgress(0);

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);

      if (progressValue >= 100) {
        clearInterval(interval);
      }
    }, 100);

    try {
      const selectedDate = form.getValues().date;
      await fetchAttendanceData(selectedDate);
      toast({
        title: "Attendance Loaded",
        description: "Attendance data loaded successfully for the selected date.",
      });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load attendance data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      clearInterval(interval);
      setProgress(0);
    }
  };

  const onSubmit = () => {
    handleSubmit();
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary delay-100"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary delay-200"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { delayChildren: 0.3, staggerChildren: 0.2 }
        }
      }}
      className="container py-8"
    >
      <motion.div variants={fadeInUp} className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Attendance for {classInfo?.name}
        </h1>
        <p className="text-muted-foreground">
          Manage attendance records for this class
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              <CalendarDays className="mr-2 h-4 w-4 inline-block align-middle" />
              Select Date
            </CardTitle>
            <CardDescription>
              Choose a date to view attendance records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          className={cn(
                            "w-full",
                            !field.value && "text-muted-foreground"
                          )}
                          onSelect={(date) => {
                            form.setValue("date", date!)
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Select a date to view the attendance records.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      Loading...
                      <Progress value={progress} className="mt-2" />
                    </>
                  ) : (
                    "Load Attendance"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              <Users className="mr-2 h-4 w-4 inline-block align-middle" />
              Attendance Summary
            </CardTitle>
            <CardDescription>
              Overview of attendance for {format(form.getValues().date, 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceData.length === 0 ? (
              <p className="text-muted-foreground">No attendance data for this date.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {attendanceData.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.students?.roll_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.students?.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateAttendanceStatus(item.id, 'present')}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateAttendanceStatus(item.id, 'absent')}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AttendancePage;
