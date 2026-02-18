# NGO Project Management System - Specification Document

## 1. Project Overview

**Project Name:** NGO Project Management System (NGO-PMS)

**Project Type:** Full-stack Web Application

**Core Functionality:** A private, role-based project management system for NGOs enabling administrators to manage projects, tasks, and team members, while employees can track and update their assigned tasks with status reporting.

**Target Users:**
- **Admin:** NGO managers/coordinators who need full control over projects, tasks, and user management
- **Employees:** Field workers and staff who need to view and update their assigned tasks

---

## 2. Technical Stack

### Frontend
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** React Context API
- **Charts/Visualization:** Recharts
- **Calendar:** react-big-calendar
- **Icons:** Lucide React
- **Image Handling:** Base64 encoding for uploads

### Backend (Mock API)
- **Solution:** Local Mock API with JSON data persistence using localStorage
- **Reasoning:** No external keys required; provides full functionality for demo purposes

### Authentication
- **Method:** JWT-based authentication (simulated)
- **Session:** localStorage with token management
- **Access:** Strictly private - no public signup

---

## 3. UI/UX Specification

### 3.1 Layout Structure

**Main Layout:**
- Sidebar navigation (fixed, 260px width on desktop)
- Top header with user info and logout (64px height)
- Main content area with padding

**Responsive Breakpoints:**
- Mobile: < 768px (sidebar becomes drawer)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 3.2 Color Palette

| Role | Color | Hex Code |
|------|-------|----------|
| Primary | Deep Teal | #0D9488 |
| Primary Dark | Dark Teal | #0F766E |
| Secondary | Warm Orange | #F97316 |
| Background | Light Gray | #F8FAFC |
| Surface | White | #FFFFFF |
| Text Primary | Dark Slate | #1E293B |
| Text Secondary | Slate Gray | #64748B |
| Success | Green | #22C55E |
| Warning | Amber | #F59E0B |
| Error | Red | #EF4444 |
| Info | Blue | #3B82F6 |

### 3.3 Typography

- **Font Family:** Inter (Google Fonts)
- **Headings:**
  - H1: 32px, font-weight: 700
  - H2: 24px, font-weight: 600
  - H3: 20px, font-weight: 600
  - H4: 16px, font-weight: 600
- **Body:** 14px, font-weight: 400
- **Small:** 12px, font-weight: 400

### 3.4 Component Design

**Buttons:**
- Primary: Teal background (#0D9488), white text, rounded-lg
- Secondary: White background, teal border, teal text
- Danger: Red background (#EF4444), white text
- States: hover (darken 10%), active (darken 15%), disabled (opacity 50%)

**Cards:**
- White background
- Border radius: 12px
- Box shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 24px

**Forms:**
- Input fields: Border radius 8px, border: #E2E8F0
- Focus state: Teal border (#0D9488), ring: 2px teal
- Labels: Slate gray, font-weight: 500

---

## 4. Feature Specification

### 4.1 Authentication System

**Login Page:**
- Email and password fields
- "Remember me" checkbox
- Error messages for invalid credentials
- Logo and app name display

**Security:**
- No public registration
- Admin creates users manually
- Password requirements: minimum 6 characters

**User Roles:**
| Role | Permissions |
|------|-------------|
| Admin | Full CRUD on projects, tasks, users, reports |
| Employee | View assigned tasks, update task status, update profile |

### 4.2 Admin Features

**User Management:**
- View all users in table format
- Create new user (name, email, role, password)
- Edit existing user details
- Delete user (soft delete)
- Search/filter users by name or role

**Project Management:**
- Create project (name, description, start date, end date, status)
- Edit project details
- Delete project (with confirmation)
- View all projects in card or table view
- Project status: Planning, Active, On Hold, Completed

**Task Management:**
- Create task within a project
- Assign task to employee(s)
- Set task properties: title, description, priority, due date, status
- Create sub-tasks with: title, timeline (start/end), area (location), description
- Delete task/sub-task
- View task details modal

### 4.3 Employee Features

**Dashboard:**
- Summary cards: Total tasks, Pending, In Progress, Completed
- Progress chart (pie or bar)
- Recent activity list

**My Tasks:**
- List of assigned tasks
- Filter by status, project, priority
- Update task status (dropdown: Not Started, In Progress, Completed)
- Add status report with text and optional image

**Profile:**
- View profile details
- Update name and email
- Change password

### 4.4 Task & Sub-task Structure

**Task Fields:**
- Title (required)
- Description
- Priority (Low, Medium, High, Urgent)
- Status (Not Started, In Progress, Completed)
- Assigned Users (multi-select)
- Due Date
- Created/Updated timestamps

**Sub-task Fields:**
- Title (required)
- Description
- Timeline: Start Date, End Date
- Area (Location - text field)
- Status (Not Started, In Progress, Completed)

### 4.5 Status Reporting

**Report Structure:**
- Task reference
- Reporter (auto-filled)
- Status at time of report
- Report text (required)
- Image attachment (optional, base64 stored)
- Timestamp

**Image Handling:**
- Max file size: 5MB
- Accepted formats: JPG, PNG, GIF
- Preview before upload
- Display in reports list

### 4.6 Dashboard & Statistics

**Admin Dashboard:**
- Total projects count
- Total tasks count
- Tasks by status (pie chart)
- Tasks by priority (bar chart)
- Project progress overview
- Recent activity feed:**
- My

**Employee Dashboard tasks summary
- Tasks by status
- Upcoming deadlines
- Recent reports

### 4.7 Calendar View

**Features:**
- Month/Week/Day views
- Display project deadlines
- Display task due dates
- Color-coded by project/priority
- Click to view task details

---

## 5. Database Schema

### Users Collection
```
{
  id: string,
  name: string,
  email: string,
  password: string (hashed),
  role: "admin" | "employee",
  avatar: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Projects Collection
```
{
  id: string,
  name: string,
  description: string,
  status: "planning" | "active" | "on_hold" | "completed",
  startDate: date,
  endDate: date,
  createdBy: userId,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Tasks Collection
```
{
  id: string,
  projectId: string,
  title: string,
  description: string,
  priority: "low" | "medium" | "high" | "urgent",
  status: "not_started" | "in_progress" | "completed",
  assignedUsers: userId[],
  dueDate: date,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### SubTasks Collection
```
{
  id: string,
  taskId: string,
  title: string,
  description: string,
  startDate: date,
  endDate: date,
  area: string,
  status: "not_started" | "in_progress" | "completed",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Reports Collection
```
{
  id: string,
  taskId: string,
  userId: string,
  status: string,
  text: string,
  image: string (base64),
  createdAt: timestamp
}
```

---

## 6. Demo Content

### Demo Projects

**1. Clean Water Initiative**
- Status: Active
- Timeline: 2025-01-15 to 2026-06-30
- Description: Installing water purification systems in rural communities
- Tasks:
  - Site Survey (Village A, B, C) - Completed
  - Equipment Procurement - In Progress
  - Installation Phase 1 - In Progress
  - Community Training - Pending
  - Water Quality Testing - Pending

**2. Community Schooling Program**
- Status: Active
- Timeline: 2025-03-01 to 2026-12-31
- Description: Building and operating community schools in underserved areas
- Tasks:
  - Teacher Recruitment - Completed
  - Curriculum Development - Completed
  - School Construction - In Progress
  - Student Enrollment - In Progress
  - Material Distribution - Pending

**3. Healthcare Awareness Campaign**
- Status: Planning
- Timeline: 2026-02-01 to 2026-08-31
- Description: Healthcare awareness and preventive medicine workshops
- Tasks:
  - Campaign Planning - In Progress
  - Material Design - Pending
  - Partner Coordination - Pending
  - Field Team Training - Pending

**4. Emergency Relief Response**
- Status: On Hold
- Timeline: 2025-11-01 to 2026-03-31
- Description: Emergency food and shelter assistance
- Tasks:
  - Needs Assessment - Completed
  - Supply Procurement - Completed
  - Distribution Phase 1 - Completed
  - Distribution Phase 2 - On Hold

---

## 7. Page Structure

### Pages Required

1. **Login** (`/login`) - Authentication
2. **Dashboard** (`/`) - Role-based dashboard
3. **Projects** (`/projects`) - Project list/management
4. **Project Detail** (`/projects/:id`) - Single project view
5. **Tasks** (`/tasks`) - All tasks (admin) / My tasks (employee)
6. **Task Detail** (`/tasks/:id`) - Single task view with sub-tasks
7. **Users** (`/users`) - User management (admin only)
8. **Calendar** (`/calendar`) - Calendar view
9. **Profile** (`/profile`) - User profile settings
10. **Reports** (`/reports`) - Status reports list

---

## 8. Acceptance Criteria

### Authentication
- [ ] Users cannot access any page without logging in
- [ ] Invalid credentials show appropriate error
- [ ] Only admin can access user management
- [ ] Session persists on page refresh

### Admin Functions
- [ ] Can create, edit, delete projects
- [ ] Can create, edit, delete tasks within projects
- [ ] Can create, edit, delete sub-tasks
- [ ] Can create, edit, delete users
- [ ] Can view all reports

### Employee Functions
- [ ] Can view assigned tasks only
- [ ] Can update task status
- [ ] Can add status reports with images
- [ ] Can update own profile

### UI/UX
- [ ] Dashboard shows charts and statistics
- [ ] Calendar displays project/task deadlines
- [ ] Responsive design works on mobile
- [ ] All forms have proper validation

### Demo Content
- [ ] 4 demo projects with realistic data
- [ ] Tasks with sub-tasks pre-populated
- [ ] Sample reports with images
