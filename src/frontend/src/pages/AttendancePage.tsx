import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Save,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type AttendanceRecord,
  mockAttendanceRecords,
  mockClasses,
  mockStudents,
} from "../lib/mockData";

type AttendanceStatus = "present" | "absent" | "late";

const statusConfig: Record<
  AttendanceStatus,
  {
    label: string;
    className: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  present: {
    label: "Present",
    className: "bg-success/10 text-success border-success/30",
    icon: CheckCircle2,
  },
  absent: {
    label: "Absent",
    className: "bg-destructive/10 text-destructive border-destructive/30",
    icon: XCircle,
  },
  late: {
    label: "Late",
    className: "bg-warning/10 text-warning border-warning/30",
    icon: Clock,
  },
};

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState("10A");
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >(() =>
    Object.fromEntries(
      mockAttendanceRecords.map((r) => [r.studentId, r.status]),
    ),
  );

  const classStudents = mockStudents.filter((s) => s.class === selectedClass);
  const counts = classStudents.reduce(
    (acc, s) => {
      const status = attendance[s.id] ?? "present";
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0 } as Record<AttendanceStatus, number>,
  );

  function setStatus(studentId: string, status: AttendanceStatus) {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  }

  function handleSubmit() {
    toast.success(`Attendance for Class ${selectedClass} saved successfully!`, {
      description: `${counts.present} present · ${counts.absent} absent · ${counts.late} late`,
    });
  }

  const statCards = [
    {
      label: "Total Students",
      value: classStudents.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Present",
      value: counts.present,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Absent",
      value: counts.absent,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Late",
      value: counts.late,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Mark daily attendance for each class
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm bg-transparent text-foreground outline-none"
              data-ocid="attendance.date.input"
            />
          </div>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-32" data-ocid="attendance.class.select">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {mockClasses.map((c) => (
                <SelectItem key={c} value={c}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-card rounded-xl border border-border shadow-card p-4"
            data-ocid={`attendance.${card.label.toLowerCase().replace(/\s+/g, "_")}.card`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">
                {card.label}
              </p>
              <div
                className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}
              >
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border shadow-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">
            Class {selectedClass} —{" "}
            {new Date(date).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2>
          <Badge variant="outline" className="text-xs">
            {classStudents.length} students
          </Badge>
        </div>

        {classStudents.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="attendance.empty_state"
          >
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No students in this class</p>
          </div>
        ) : (
          <Table data-ocid="attendance.table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Roll No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((student, i) => {
                const status = attendance[student.id] ?? "present";
                return (
                  <TableRow
                    key={student.id}
                    data-ocid={`attendance.item.${i + 1}`}
                  >
                    <TableCell className="font-mono text-muted-foreground text-sm">
                      {student.rollNo.toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {(
                          ["present", "absent", "late"] as AttendanceStatus[]
                        ).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(student.id, s)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                              status === s
                                ? statusConfig[s].className
                                : "border-border text-muted-foreground hover:bg-accent"
                            }`}
                            data-ocid={`attendance.${s}.toggle`}
                          >
                            {statusConfig[s].label}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <div className="mt-5 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="gap-2"
            data-ocid="attendance.submit_button"
          >
            <Save className="w-4 h-4" />
            Submit Attendance
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
