# EscolaUI

## Current State
- Dashboard, Login, Admissions (list + new application form) are fully implemented.
- Attendance, Fees, Schedule (Timetable), Students, Teachers, Exams, Staff, Reports, Settings all show PlaceholderPage.
- Mock data exists in lib/mockData.ts.

## Requested Changes (Diff)

### Add
- AttendancePage: class-based daily attendance marking with present/absent/late toggles, summary stats, and a per-class table.
- FeesPage: invoice list with filter by status (paid/pending/overdue), total collected vs outstanding summary cards, and a payment modal.
- SchedulePage (Timetable): weekly grid timetable view with period slots per class/day, colour-coded by subject.
- Extended mock data for students, teachers, timetable slots, and invoice details.

### Modify
- App.tsx: replace PlaceholderPage for /attendance, /fees, /schedule with the new full pages.
- lib/mockData.ts: add mock data for the three new modules.

### Remove
- Nothing removed.

## Implementation Plan
1. Extend mockData.ts with attendance records, fee invoices, and timetable entries.
2. Build AttendancePage with daily class selector, student list with attendance toggle, and summary stats.
3. Build FeesPage with stat cards, filterable invoice table, and "Record Payment" modal.
4. Build SchedulePage with a 5-day × 8-period weekly grid coloured by subject.
5. Update App.tsx to route to the three new pages.
