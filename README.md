# Student Academic Performance Dashboard

A clean, responsive single-page academic dashboard built with React and Vite. Designed for college students to monitor their grades, GPA, attendance eligibility, and assignment deadlines with browser LocalStorage persistence.

## Features

- **Academic Calculations & Grade Engine**:
  - Converts percentage scores (0–100%) into standard letter grades (A+, A, B, C, D, F) and grade points (0.0 to 4.0).
  - Computes credit-weighted average percentage and cumulative GPA:
    $$\text{Cumulative GPA} = \frac{\sum (\text{Subject GPA} \times \text{Credits})}{\sum \text{Credits}}$$

- **Dynamic Visualizations (Recharts)**:
  - **Subject Marks Comparison**: Bar chart displaying marks per subject against a clearly visible 50% passing threshold.
  - **Term-over-Term Trend**: Dual-axis line chart illustrating average marks (%) and GPA across academic terms based strictly on available term data.

- **Attendance Monitor & Shortage Alerts**:
  - Real-time attendance percentage per course and overall.
  - 75% minimum eligibility warnings displaying exact consecutive classes needed to restore 75% compliance.
  - One-click quick log buttons (`+ Attended`, `+ Absent`) to instantly update classes and dependent metrics.

- **Assignment and Task Tracker**:
  - Filter tabs: All, Pending, Completed (includes Submitted & Graded).
  - Search by title or subject, plus subject dropdown filter.
  - Due date warning badges for overdue assignments and deadlines within 48 hours.

- **Persistent Browser Storage**:
  - Synchronizes all courses, attendance records, and tasks to `window.localStorage`.
  - Includes a "Clear All Data" option in the navbar to clear stored records and return to the empty state.

## Project Structure

```text
src/
├── assets/
│   └── styles.css                     # Base styling and layout rules
├── components/
│   ├── Navbar.jsx                     # Top navigation with GPA and action buttons
│   ├── MetricCards.jsx                # Summary metrics and attendance shortage alert
│   ├── AttendanceTracker.jsx          # Subject attendance cards with quick log buttons
│   ├── AssignmentManager.jsx          # Filterable task and deadline tracker
│   ├── SubjectList.jsx                # Registered courses table with grade & GPA badges
│   ├── Charts/
│   │   ├── MarksBarChart.jsx          # Recharts bar chart with 50% passing line
│   │   └── TrendLineChart.jsx         # Recharts term-by-term performance line chart
│   └── Forms/
│       ├── SubjectForm.jsx            # Form modal to add and edit subjects
│       ├── AssignmentForm.jsx         # Form modal for tasks and deadlines
│       └── AttendanceForm.jsx         # Form modal for classes held and attended
├── hooks/
│   ├── useLocalStorage.js            # Syncs React state with window.localStorage
│   └── useAcademicCalculations.js     # GPA, weighted averages, and attendance metrics
├── utils/
│   ├── gradeHelpers.js                # Grade scale, letter grades, and GPA calculations
│   └── dateUtils.js                   # Date formatting and 48-hour deadline checks
├── App.jsx                            # Central state and component orchestration
└── main.jsx                           # Application entry point
```

## Running the Project

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```
