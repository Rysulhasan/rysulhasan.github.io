# NGO Project Management System (NGO-PMS)

A full-stack Project Management System designed for NGOs, built with React (Vite), Tailwind CSS, and a localStorage-based mock API for authentication and data persistence.

## Features

### Authentication & Roles
- **Private Application**: No public signup - users are created by Admin
- **Role-based Access Control**: Admin and Employee roles
- **Session Persistence**: JWT-simulated authentication with localStorage

### Admin Features
- **User Management**: Create, edit, and delete users
- **Project Management**: Full CRUD operations on projects
- **Task Management**: Create, edit, and delete tasks with sub-tasks
- **View All Reports**: Access to all status reports from employees

### Employee Features
- **Dashboard**: View personal task statistics and upcoming deadlines
- **My Tasks**: View assigned tasks with filtering options
- **Status Reporting**: Submit reports with text and image attachments
- **Profile Management**: Update name, email, and password

### Project & Task Management
- **Projects**: Create with name, description, timeline, and status
- **Tasks**: Assign to employees, set priority, due dates, and status
- **Sub-tasks**: Include timeline (start/end), area (location), and description
- **Status Tracking**: Not Started, In Progress, Completed

### Dashboard & Visualization
- **Statistics Cards**: Total projects, tasks, in-progress, completed
- **Charts**: Pie chart for task status, Bar chart for task priority
- **Upcoming Deadlines**: Tasks due within 14 days
- **Recent Activity**: Latest status reports
- **Project Progress**: Visual progress bars for each project

### Calendar View
- **Monthly Calendar**: Navigate between months
- **Visual Indicators**: Color-coded project deadlines and task due dates
- **Date Selection**: Click to view details for specific dates

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ngo.org | admin123 |
| Employee | sarah@ngo.org | employee123 |
| Employee | michael@ngo.org | employee123 |
| Employee | emily@ngo.org | employee123 |
| Employee | james@ngo.org | employee123 |

## Demo Content

The system comes pre-loaded with 4 demo NGO projects:

1. **Clean Water Initiative** (Active)
   - Site Survey, Equipment Procurement, Installation, Community Training, Water Quality Testing

2. **Community Schooling Program** (Active)
   - Teacher Recruitment, Curriculum Development, School Construction, Student Enrollment, Material Distribution

3. **Healthcare Awareness Campaign** (Planning)
   - Campaign Planning, Material Design, Partner Coordination, Field Team Training

4. **Emergency Relief Response** (On Hold)
   - Needs Assessment, Supply Procurement, Distribution Phases

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Backend**: Local Mock API with localStorage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd "Project Management/ngo-pms"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
ngo-pms/
|-- public/
|-- src/
|   |-- components/
|   |   |-- common/
|   |   |   |-- ProtectedRoute.jsx
|   |   |-- layout/
|   |       |-- Header.jsx
|   |       |-- MainLayout.jsx
|   |       |-- Sidebar.jsx
|   |-- context/
|   |   |-- AuthContext.jsx
|   |-- data/
|   |   |-- demoData.js
|   |-- pages/
|   |   |-- Calendar.jsx
|   |   |-- Dashboard.jsx
|   |   |-- Login.jsx
|   |   |-- Profile.jsx
|   |   |-- Projects.jsx
|   |   |-- Reports.jsx
|   |   |-- Tasks.jsx
|   |   |-- Users.jsx
|   |-- services/
|   |   |-- api.js
|   |-- App.jsx
|   |-- index.css
|   |-- main.jsx
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- vite.config.js
```

## Color Palette

| Role | Color | Hex Code |
|------|-------|----------|
| Primary | Deep Teal | #0D9488 |
| Primary Dark | Dark Teal | #0F766E |
| Secondary | Warm Orange | #F97316 |
| Background | Light Gray | #F8FAFC |
| Success | Green | #22C55E |
| Warning | Amber | #F59E0B |
| Error | Red | #EF4444 |
| Info | Blue | #3B82F6 |

## Key Features Implementation

### Image Upload
- Base64 encoding for image storage
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF
- Preview before submission

### Sub-tasks
- Each sub-task includes:
  - Title and description
  - Timeline (start and end dates)
  - Area/Location field
  - Status tracking

### Responsive Design
- Mobile: Sidebar becomes drawer overlay
- Tablet/Desktop: Fixed sidebar navigation
- All tables and grids are responsive

## Reset Demo Data

To reset all data to the initial demo state, open the browser console and run:

```javascript
localStorage.clear();
window.location.reload();
```

## License

This project is for demonstration purposes.

## Support

For any issues or questions, please contact the system administrator.