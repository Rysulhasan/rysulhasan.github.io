import { useState, useEffect } from 'react';
import { reportsAPI, tasksAPI, usersAPI, projectsAPI, taskHeadsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  FileText,
  User,
  Calendar,
  Image,
  X,
  Filter,
  Download,
  Tag,
  FolderKanban,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Reports = () => {
  const { user, isAdmin } = useAuth();
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskHeads, setTaskHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [taskHeadFilter, setTaskHeadFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [reportsData, tasksData, usersData, projectsData, taskHeadsData] = await Promise.all([
        reportsAPI.getAll(isAdmin() ? {} : { userId: user?.id }),
        tasksAPI.getAll(isAdmin() ? {} : { assignedUserId: user?.id }),
        usersAPI.getAll(),
        projectsAPI.getAll(),
        taskHeadsAPI.getAll()
      ]);
      
      setReports(reportsData);
      setTasks(tasksData);
      setUsers(usersData);
      setProjects(projectsData);
      setTaskHeads(taskHeadsData);
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

  const getProject = (projectId) => {
    return projects.find(p => p.id === projectId);
  };

  const getTaskHead = (taskHeadId) => {
    return taskHeads.find(th => th.id === taskHeadId);
  };

  const filteredReports = reports.filter((report) => {
    const task = getTask(report.taskId);
    const matchesSearch = 
      report.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesProject = projectFilter === 'all' || task?.projectId === projectFilter;
    const matchesTaskHead = taskHeadFilter === 'all' || task?.taskHeadId === taskHeadFilter;
    return matchesSearch && matchesStatus && matchesProject && matchesTaskHead;
  });

  // Group reports by task head
  const groupedReports = () => {
    const groups = {};
    
    filteredReports.forEach(report => {
      const task = getTask(report.taskId);
      const taskHeadId = task?.taskHeadId || 'unassigned';
      const taskHead = taskHeadId !== 'unassigned' ? getTaskHead(taskHeadId) : null;
      const projectId = task?.projectId || 'unknown';
      const project = getProject(projectId);
      
      const groupKey = taskHeadId;
      const groupName = taskHead ? taskHead.name : 'Unassigned Tasks';
      const groupColor = taskHead?.color || '#6B7280';
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          id: taskHeadId,
          name: groupName,
          color: groupColor,
          project: project?.name || 'Unknown Project',
          projectId: projectId,
          reports: []
        };
      }
      
      groups[groupKey].reports.push(report);
    });
    
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const expandAll = () => {
    const groups = groupedReports();
    const expanded = {};
    groups.forEach(g => expanded[g.id] = true);
    setExpandedGroups(expanded);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

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

  // Download reports as HTML file with embedded images
  const downloadReports = async (group = null) => {
    setDownloading(true);
    
    try {
      const reportsToDownload = group ? group.reports : filteredReports;
      const groupName = group ? group.name : 'All Reports';
      const groupColor = group?.color || '#0D9488';
      
      // Build HTML content
      let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${groupName} - NGO Project Management Reports</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: #f8fafc; 
      color: #1e293b; 
      line-height: 1.6;
      padding: 20px;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header { 
      background: linear-gradient(135deg, ${groupColor}, ${groupColor}dd); 
      color: white; 
      padding: 30px; 
      border-radius: 12px; 
      margin-bottom: 30px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .meta { 
      display: flex; 
      gap: 20px; 
      margin-top: 15px; 
      font-size: 13px;
      opacity: 0.85;
    }
    .report-card { 
      background: white; 
      border-radius: 12px; 
      padding: 24px; 
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    .report-header { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    .avatar { 
      width: 40px; 
      height: 40px; 
      border-radius: 50%; 
      background: ${groupColor}20;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: ${groupColor};
    }
    .report-info { flex: 1; }
    .report-info h3 { font-size: 16px; color: #1e293b; }
    .report-info .date { font-size: 13px; color: #64748b; }
    .status { 
      display: inline-block;
      padding: 4px 12px; 
      border-radius: 20px; 
      font-size: 12px; 
      font-weight: 500;
    }
    .status-not_started { background: #dbeafe; color: #1e40af; }
    .status-in_progress { background: #ccfbf1; color: #0f766e; }
    .status-completed { background: #dcfce7; color: #166534; }
    .task-ref { 
      background: #f8fafc; 
      padding: 12px 16px; 
      border-radius: 8px; 
      margin-bottom: 16px;
      border-left: 3px solid ${groupColor};
    }
    .task-ref p { font-size: 12px; color: #64748b; }
    .task-ref h4 { font-size: 15px; color: #1e293b; margin-top: 4px; }
    .report-text { 
      white-space: pre-wrap; 
      color: #334155;
      font-size: 14px;
    }
    .report-image { 
      margin-top: 16px; 
      border-radius: 8px;
      max-width: 100%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .footer { 
      text-align: center; 
      padding: 30px; 
      color: #64748b; 
      font-size: 13px;
      border-top: 1px solid #e2e8f0;
      margin-top: 30px;
    }
    @media print {
      body { background: white; }
      .report-card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${groupName}</h1>
      <p>NGO Project Management System - Status Reports</p>
      <div class="meta">
        <span>Generated: ${format(new Date(), 'MMMM d, yyyy h:mm a')}</span>
        <span>•</span>
        <span>${reportsToDownload.length} report${reportsToDownload.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
`;

      reportsToDownload.forEach(report => {
        const task = getTask(report.taskId);
        const reportUser = getUser(report.userId);
        const project = task ? getProject(task.projectId) : null;
        const taskHead = task?.taskHeadId ? getTaskHead(task.taskHeadId) : null;
        
        htmlContent += `
    <div class="report-card">
      <div class="report-header">
        <div class="avatar">${reportUser?.name?.charAt(0).toUpperCase() || '?'}</div>
        <div class="report-info">
          <h3>${reportUser?.name || 'Unknown User'}</h3>
          <div class="date">${format(parseISO(report.createdAt), 'MMMM d, yyyy h:mm a')}</div>
        </div>
        <span class="status status-${report.status}">${getStatusLabel(report.status)}</span>
      </div>
`;

        if (task) {
          htmlContent += `
      <div class="task-ref">
        <p>Task: ${task.title}</p>
        ${project ? `<p style="margin-top: 4px;">Project: ${project.name}</p>` : ''}
        ${taskHead ? `<p style="margin-top: 4px;">Task Head: ${taskHead.name}</p>` : ''}
      </div>
`;
        }

        htmlContent += `
      <div class="report-text">${report.text}</div>
`;

        if (report.image) {
          htmlContent += `
      <img src="${report.image}" alt="Report attachment" class="report-image" />
`;
        }

        htmlContent += `
    </div>
`;
      });

      htmlContent += `
    <div class="footer">
      <p>Generated by NGO Project Management System</p>
      <p style="margin-top: 4px;">© ${new Date().getFullYear()} All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

      // Create and download the file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${groupName.replace(/[^a-z0-9]/gi, '_')}_Reports_${format(new Date(), 'yyyy-MM-dd')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download reports');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const groups = groupedReports();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Status Reports</h1>
          <p className="text-text-secondary mt-1">
            {isAdmin() ? 'View and download reports categorized by task head' : 'View your submitted reports'}
          </p>
        </div>
        {isAdmin() && filteredReports.length > 0 && (
          <button
            onClick={() => downloadReports()}
            disabled={downloading}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Downloading...' : 'Download All Reports'}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col gap-4">
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
            <select
              value={projectFilter}
              onChange={(e) => {
                setProjectFilter(e.target.value);
                setTaskHeadFilter('all');
              }}
              className="input-field w-full sm:w-48"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <select
              value={taskHeadFilter}
              onChange={(e) => setTaskHeadFilter(e.target.value)}
              className="input-field w-full sm:w-48"
            >
              <option value="all">All Task Heads</option>
              {taskHeads
                .filter(th => projectFilter === 'all' || th.projectId === projectFilter)
                .map(head => (
                  <option key={head.id} value={head.id}>{head.name}</option>
                ))
              }
            </select>
          </div>
          
          {/* Group Actions */}
          {groups.length > 0 && (
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <span className="text-sm text-text-secondary">Grouped by Task Head:</span>
              <button
                onClick={expandAll}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Collapse All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grouped Reports */}
      <div className="space-y-4">
        {groups.map((group) => {
          const isExpanded = expandedGroups[group.id] !== false; // Default to expanded
          
          return (
            <div key={group.id} className="card overflow-hidden">
              {/* Group Header */}
              <div
                className="flex items-center justify-between cursor-pointer -mx-6 -mt-6 px-6 py-4 bg-gray-50 border-b border-gray-100"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex items-center gap-3">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-text-secondary" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-text-secondary" />
                    )}
                  </button>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-text-primary">{group.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <FolderKanban className="w-3 h-3" />
                      <span>{group.project}</span>
                      <span>•</span>
                      <span>{group.reports.length} report{group.reports.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                {isAdmin() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadReports(group);
                    }}
                    disabled={downloading}
                    className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>
              
              {/* Reports in Group */}
              {isExpanded && (
                <div className="mt-4 space-y-4">
                  {group.reports.map((report) => {
                    const task = getTask(report.taskId);
                    const reportUser = getUser(report.userId);
                    
                    return (
                      <div key={report.id} className="border border-gray-100 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${group.color}20` }}
                          >
                            <span className="text-sm font-medium" style={{ color: group.color }}>
                              {reportUser?.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="font-medium text-text-primary">
                                {reportUser?.name || 'Unknown User'}
                              </span>
                              <span className={getStatusBadgeClass(report.status)}>
                                {getStatusLabel(report.status)}
                              </span>
                              <span className="text-sm text-text-secondary">
                                {format(parseISO(report.createdAt), 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>

                            {task && (
                              <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                                <span className="text-text-secondary">Task: </span>
                                <span className="font-medium text-text-primary">{task.title}</span>
                              </div>
                            )}

                            <p className="text-text-primary whitespace-pre-wrap text-sm">
                              {report.text}
                            </p>

                            {report.image && (
                              <div className="mt-3">
                                <button
                                  onClick={() => setSelectedImage(report.image)}
                                  className="relative group"
                                >
                                  <img
                                    src={report.image}
                                    alt="Report attachment"
                                    className="max-h-32 rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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