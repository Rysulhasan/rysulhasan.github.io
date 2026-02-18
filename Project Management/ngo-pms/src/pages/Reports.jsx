import { useState, useEffect } from 'react';
import { reportsAPI, tasksAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  FileText,
  User,
  Calendar,
  Image,
  X,
  Filter
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Reports = () => {
  const { user, isAdmin } = useAuth();
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [reportsData, tasksData, usersData] = await Promise.all([
        reportsAPI.getAll(isAdmin() ? {} : { userId: user?.id }),
        tasksAPI.getAll(isAdmin() ? {} : { assignedUserId: user?.id }),
        usersAPI.getAll()
      ]);
      
      setReports(reportsData);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTask = (taskId) => {
    return tasks.find(t => t.id === taskId);
  };

  const getUser = (userId) => {
    return users.find(u => u.id === userId);
  };

  const filteredReports = reports.filter((report) => {
    const task = getTask(report.taskId);
    const matchesSearch = 
      report.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    const classes = {
      not_started: 'badge-info',
      in_progress: 'badge-primary',
      completed: 'badge-success'
    };
    return classes[status] || 'badge-info';
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Status Reports</h1>
        <p className="text-text-secondary mt-1">
          {isAdmin() ? 'View all status reports from team members' : 'View your submitted reports'}
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const task = getTask(report.taskId);
          const reportUser = getUser(report.userId);
          
          return (
            <div key={report.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {reportUser?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-text-primary">
                          {reportUser?.name || 'Unknown User'}
                        </span>
                        <span className={getStatusBadgeClass(report.status)}>
                          {getStatusLabel(report.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary mt-0.5">
                        <Calendar className="w-4 h-4" />
                        {format(parseISO(report.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  </div>

                  {/* Task Reference */}
                  {task && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-text-secondary">Task:</p>
                      <p className="font-medium text-text-primary">{task.title}</p>
                    </div>
                  )}

                  {/* Report Text */}
                  <p className="text-text-primary whitespace-pre-wrap">
                    {report.text}
                  </p>

                  {/* Image Attachment */}
                  {report.image && (
                    <div className="mt-4">
                      <button
                        onClick={() => setSelectedImage(report.image)}
                        className="relative group"
                      >
                        <img
                          src={report.image}
                          alt="Report attachment"
                          className="max-h-48 rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg">
                          <Image className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-text-secondary">No reports found</p>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Reports;