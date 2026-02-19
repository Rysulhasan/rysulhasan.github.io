import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statsAPI, projectsAPI, tasksAPI, usersAPI } from '../services/api';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [statsData, projectsData, tasksData] = await Promise.all([
        statsAPI.getDashboardStats(user?.id, user?.role),
        projectsAPI.getAll(),
        tasksAPI.getAll(isAdmin() ? {} : { assignedUserId: user?.id })
      ]);
      
      setStats(statsData);
      setProjects(projectsData);
      setTasks(tasksData);
      
      if (isAdmin()) {
        const usersData = await usersAPI.getAll();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: '#64748B',
      in_progress: '#3B82F6',
      completed: '#22C55E'
    };
    return colors[status] || '#64748B';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#22C55E',
      medium: '#F59E0B',
      high: '#F97316',
      urgent: '#EF4444'
    };
    return colors[priority] || '#64748B';
  };

  const getProjectStatusColor = (status) => {
    const colors = {
      planning: '#64748B',
      active: '#0D9488',
      on_hold: '#F59E0B',
      completed: '#22C55E'
    };
    return colors[status] || '#64748B';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const taskStatusData = stats?.tasksByStatus ? [
    { name: 'Not Started', value: stats.tasksByStatus.not_started, color: '#64748B' },
    { name: 'In Progress', value: stats.tasksByStatus.in_progress, color: '#3B82F6' },
    { name: 'Completed', value: stats.tasksByStatus.completed, color: '#22C55E' }
  ].filter(item => item.value > 0) : [];

  const taskPriorityData = stats?.tasksByPriority ? [
    { name: 'Low', value: stats.tasksByPriority.low, color: '#22C55E' },
    { name: 'Medium', value: stats.tasksByPriority.medium, color: '#F59E0B' },
    { name: 'High', value: stats.tasksByPriority.high, color: '#F97316' },
    { name: 'Urgent', value: stats.tasksByPriority.urgent, color: '#EF4444' }
  ].filter(item => item.value > 0) : [];

  // Get upcoming deadlines
  const today = new Date();
  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .map(t => {
      const project = projects.find(p => p.id === t.projectId);
      return { ...t, projectName: project?.name };
    })
    .filter(t => {
      const dueDate = parseISO(t.dueDate);
      return isAfter(dueDate, today) && isBefore(dueDate, addDays(today, 14));
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-text-secondary mt-1">
          Here's what's happening with your {isAdmin() ? 'organization' : 'tasks'} today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Projects</p>
              <p className="text-2xl font-bold text-text-primary">{stats?.totalProjects || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Tasks</p>
              <p className="text-2xl font-bold text-text-primary">{stats?.totalTasks || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">In Progress</p>
              <p className="text-2xl font-bold text-text-primary">
                {stats?.tasksByStatus?.in_progress || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Completed</p>
              <p className="text-2xl font-bold text-text-primary">
                {stats?.tasksByStatus?.completed || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Tasks by Status</h3>
          {taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-text-secondary">
              No task data available
            </div>
          )}
        </div>

        {/* Task Priority Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Tasks by Priority</h3>
          {taskPriorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskPriorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-text-secondary">
              No task data available
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Upcoming Deadlines</h3>
            <Calendar className="w-5 h-5 text-text-secondary" />
          </div>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{task.title}</p>
                    <p className="text-sm text-text-secondary truncate">{task.projectName}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span
                      className="badge"
                      style={{ backgroundColor: getPriorityColor(task.priority) + '20', color: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {format(parseISO(task.dueDate), 'MMM d')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">No upcoming deadlines in the next 14 days</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
            <TrendingUp className="w-5 h-5 text-text-secondary" />
          </div>
          {stats?.recentReports?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentReports.map((report) => {
                const task = tasks.find(t => t.id === report.taskId);
                return (
                  <div
                    key={report.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2"
                      style={{ backgroundColor: getStatusColor(report.status) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">
                        {task?.title || 'Unknown Task'}
                      </p>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {report.text}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {format(parseISO(report.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">No recent activity</p>
          )}
        </div>
      </div>

      {/* Admin Only: Projects Overview */}
      {isAdmin() && (
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Projects Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((project) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
              const progress = projectTasks.length > 0 
                ? Math.round((completedTasks / projectTasks.length) * 100) 
                : 0;
              
              return (
                <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary truncate">{project.name}</h4>
                    <span
                      className="badge"
                      style={{ 
                        backgroundColor: getProjectStatusColor(project.status) + '20', 
                        color: getProjectStatusColor(project.status) 
                      }}
                    >
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: getProjectStatusColor(project.status)
                      }}
                    />
                  </div>
                  <p className="text-sm text-text-secondary">
                    {completedTasks}/{projectTasks.length} tasks completed ({progress}%)
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;