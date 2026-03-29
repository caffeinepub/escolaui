import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Calculator,
  Dumbbell,
  FlaskConical,
  Globe,
  Monitor,
  Music,
  Palette,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  type TimetableEntry,
  mockClasses,
  mockTimetable,
} from "../lib/mockData";

const DAYS: TimetableEntry["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_LABELS: Record<TimetableEntry["day"], string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];
const PERIOD_TIMES: Record<number, string> = {
  1: "7:30–8:20",
  2: "8:25–9:15",
  3: "9:20–10:10",
  4: "10:30–11:20",
  5: "11:25–12:15",
  6: "13:00–13:50",
  7: "13:55–14:45",
  8: "14:50–15:40",
};

const subjectColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Mathematics: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  English: {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  Physics: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
  },
  Chemistry: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  Biology: {
    bg: "bg-green-50 dark:bg-green-950/40",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
  },
  History: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
  },
  Art: {
    bg: "bg-pink-50 dark:bg-pink-950/40",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800",
  },
  ICT: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-800",
  },
  "Physical Education": {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
  },
};

const subjectIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Mathematics: Calculator,
  English: BookOpen,
  Physics: FlaskConical,
  Chemistry: FlaskConical,
  Biology: Globe,
  History: Globe,
  Art: Palette,
  ICT: Monitor,
  Music: Music,
  "Physical Education": Dumbbell,
};

function SubjectCell({ entry }: { entry: TimetableEntry | undefined }) {
  if (!entry) {
    return (
      <div className="h-full flex items-center justify-center px-2 py-3">
        <span className="text-xs text-muted-foreground/40 font-medium">
          Free
        </span>
      </div>
    );
  }

  const colors = subjectColors[entry.subject] ?? {
    bg: "bg-muted/30",
    text: "text-foreground",
    border: "border-border",
  };
  const Icon = subjectIcons[entry.subject];

  return (
    <div
      className={`h-full rounded-lg border ${colors.bg} ${colors.border} px-2 py-2 flex flex-col justify-between m-0.5`}
    >
      <div className="flex items-start gap-1.5">
        {Icon && (
          <Icon className={`w-3 h-3 mt-0.5 flex-shrink-0 ${colors.text}`} />
        )}
        <span className={`text-xs font-semibold leading-tight ${colors.text}`}>
          {entry.subject}
        </span>
      </div>
      <div className="mt-1">
        <p className="text-[10px] text-muted-foreground leading-tight">
          {entry.teacher}
        </p>
        <p className="text-[10px] text-muted-foreground/70">{entry.room}</p>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [selectedClass, setSelectedClass] = useState("10A");

  const timetableMap: Record<string, TimetableEntry> = {};
  for (const entry of mockTimetable) {
    timetableMap[`${entry.day}-${entry.period}`] = entry;
  }

  const subjects = Array.from(
    new Set(mockTimetable.map((e) => e.subject)),
  ).sort();

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
          <h1 className="text-xl font-bold text-foreground">
            Schedule &amp; Timetable
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Weekly class schedule and period allocations
          </p>
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-36" data-ocid="schedule.class.select">
            <SelectValue placeholder="Select Class" />
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

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => {
          const colors = subjectColors[subject];
          if (!colors) return null;
          return (
            <span
              key={subject}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {subject}
            </span>
          );
        })}
      </div>

      {/* Desktop Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-xl border border-border shadow-card overflow-hidden hidden md:block"
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}
        >
          {/* Header Row */}
          <div className="bg-muted/50 border-b border-r border-border px-3 py-3 flex items-center">
            <span className="text-xs font-semibold text-muted-foreground">
              Period
            </span>
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="bg-muted/50 border-b border-r border-border last:border-r-0 px-3 py-3 text-center"
            >
              <p className="text-xs font-bold text-foreground">
                {DAY_LABELS[day]}
              </p>
              <p className="text-[10px] text-muted-foreground">{day}</p>
            </div>
          ))}

          {/* Period Rows */}
          {PERIODS.map((period) => (
            <>
              <div
                key={`period-${period}`}
                className="border-b border-r border-border px-2 py-2 flex flex-col items-center justify-center bg-muted/20"
              >
                <span className="text-xs font-bold text-foreground">
                  {period}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight text-center">
                  {PERIOD_TIMES[period]}
                </span>
              </div>
              {DAYS.map((day) => (
                <div
                  key={`${day}-${period}`}
                  className="border-b border-r border-border last:border-r-0 min-h-[80px]"
                  data-ocid={`schedule.${day.toLowerCase()}.period.${period}.card`}
                >
                  <SubjectCell entry={timetableMap[`${day}-${period}`]} />
                </div>
              ))}
            </>
          ))}
        </div>
      </motion.div>

      {/* Mobile: vertical grouped by day */}
      <div className="md:hidden space-y-4">
        {DAYS.map((day, di) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * di }}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
          >
            <div className="bg-muted/50 px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm text-foreground">
                {DAY_LABELS[day]}
              </h3>
            </div>
            <div className="divide-y divide-border">
              {PERIODS.map((period) => {
                const entry = timetableMap[`${day}-${period}`];
                return (
                  <div
                    key={period}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="w-12 flex-shrink-0 text-center">
                      <p className="text-xs font-bold text-foreground">
                        P{period}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {PERIOD_TIMES[period]}
                      </p>
                    </div>
                    {entry ? (
                      <div className="flex-1">
                        <p
                          className={`text-sm font-semibold ${subjectColors[entry.subject]?.text ?? "text-foreground"}`}
                        >
                          {entry.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.teacher} · {entry.room}
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground/40 font-medium">
                          Free Period
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
