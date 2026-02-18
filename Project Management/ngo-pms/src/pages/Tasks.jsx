import { useState, useEffect } from 'react';
import { tasksAPI, subtasksAPI, projectsAPI, usersAPI, reportsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  MapPin,
  AlertCircle,
  Image,
  Send
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [subtasks, setSubtasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [expandedTasks, setExpandedTasks] = useState({});
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [reportingTask, setReportingTask] = useState(null);
  
  // Form states
  const [taskForm, setTaskForm] = useState({
    projectId: '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'not_started',
    assignedUsers: [],
    dueDate: ''
  });
  const [subtaskForm, setSubtaskForm] = useState({
    taskId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    area: '',
    status: 'not_started'
  });
  const [reportForm, setReportForm] = useState({
    taskId: '',
    status: 'not_started',
    text: '',
    image: null
  });
  
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [tasksData, projectsData, usersData] = await Promise.all([
        tasksAPI.getAll(isAdmin() ? {} : { assignedUserId: user?.id }),
        projectsAPI.getAll(),
        usersAPI.getAll()
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
      setAllUsers(usersData);
      
      // Load subtasks for each task
      const subtasksData = {};
      for (const task of tasksData) {
        const taskSubtasks = await subtasksAPI.getByTaskId(task.id);
        subtasksData[task.id] = taskSubtasks;
      }
      setSubtasks(subtasksData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesProject = projectFilter === 'all' || task.projectId === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const getProjectName = (projectId) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown Project';
  };

  const getAssignedUserNames = (userIds) => {
    return userIds
      .map(id => allUsers.find(u => u.id === id)?.name || 'Unknown')
      .join(', ');
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Task Modal Functions
  const openCreateTaskModal = () => {
    setEditingTask(null);
    setTaskForm({
      projectId: '',
      title: '',
      description: '',
      priority: 'medium',
      status: 'not_started',
      assignedUsers: [],
      dueDate: ''
    });
    setFormError('');
    setShowTaskModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignedUsers: task.assignedUsers,
      dueDate: task.dueDate
    });
    setFormError('');
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingTask) {
        await tasksAPI.update(editingTask.id, taskForm);
      } else {
        await tasksAPI.create(taskForm);
      }
      await loadData();
      setShowTaskModal(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? All subtasks and reports will also be deleted.')) {
      try {
        await tasksAPI.delete(taskId);
        await loadData();
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task');
      }
    }
  };

  // Subtask Modal Functions
  const openCreateSubtaskModal = (taskId) => {
    setEditingSubtask(null);
    setSubtaskForm({
      taskId,
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      area: '',
      status: 'not_started'
    });
    setFormError('');
    setShowSubtaskModal(true);
  };

  const openEditSubtaskModal = (subtask) => {
    setEditingSubtask(subtask);
    setSubtaskForm({
      taskId: subtask.taskId,
      title: subtask.title,
      description: subtask.description,
      startDate: subtask.startDate,
      endDate: subtask.endDate,
      area: subtask.area,
      status: subtask.status
    });
    setFormError('');
    setShowSubtaskModal(true);
  };

  const handleSubtaskSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingSubtask) {
        await subtasksAPI.update(editingSubtask.id, subtaskForm);
      } else {
        await subtasksAPI.create(subtaskForm);
      }
      await loadData();
      setShowSubtaskModal(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (window.confirm('Are you sure you want to delete this subtask?')) {
      try {
        await subtasksAPI.delete(subtaskId);
        await loadData();
      } catch (error) {
        console.error('Failed to delete subtask:', error);
        alert('Failed to delete subtask');
      }
    }
  };

  // Report Modal Functions
  const openReportModal = (task) => {
    setReportingTask(task);
    setReportForm({
      taskId: task.id,
      status: task.status,
      text: '',
      image: null
    });
    setFormError('');
    setShowReportModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      // Create report
      await reportsAPI.create({
        taskId: reportForm.taskId,
        userId: user.id,
        status: reportForm.status,
        text: reportForm.text,
        image: reportForm.image
      });
      
      // Update task status
      await tasksAPI.updateStatus(reportForm.taskId, reportForm.status);
      
      await loadData();
      setShowReportModal(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      not_started: 'badge-info',
      in_progress: 'badge-primary',
      completed: 'badge-success'
    };
    return classes[status] || 'badge-info';
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      low: 'badge-success',
      medium: 'badge-warning',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'badge-error'
    };
    return classes[priority] || 'badge-info';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {isAdmin() ? 'All Tasks' : 'My Tasks'}
          </h1>
          <p className="text-text-secondary mt-1">
            {isAdmin() ? 'Manage all tasks and subtasks' : 'View and update your assigned tasks'}
          </p>
        </div>
        {isAdmin() && (
          <button onClick={openCreateTaskModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search tasks..."
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
            onChange={(e) => setProjectFilter(e.target.value)}
            className="input-field w-full sm:w-48"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const taskSubtasks = subtasks[task.id] || [];
          const isExpanded = expandedTasks[task.id];
          
          return (
            <div key={task.id} className="card">
              {/* Task Header */}
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTaskExpand(task.id)}
                  className="mt-1 p-1 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-text-secondary" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-text-secondary" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary">{task.title}</h3>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={getStatusBadgeClass(task.status)}>
                        {getStatusLabel(task.status)}
                      </span>
                      <span className={getPriorityBadgeClass(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-text-secondary">
                    <span className="truncate">{getProjectName(task.projectId)}</span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">
                        {getAssignedUserNames(task.assignedUsers)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-4 h-4" />
                      {taskSubtasks.length} subtasks
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!isAdmin() && task.assignedUsers.includes(user?.id) && (
                    <button
                      onClick={() => openReportModal(task)}
                      className="btn-secondary text-sm py-1.5"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Report
                    </button>
                  )}
                  {isAdmin() && (
                    <>
                      <button
                        onClick={() => openEditTaskModal(task)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary hover:text-primary"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-text-secondary hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Subtasks */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-text-primary">Subtasks</h4>
                    {isAdmin() && (
                      <button
                        onClick={() => openCreateSubtaskModal(task.id)}
                        className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Subtask
                      </button>
                    )}
                  </div>
                  
                  {taskSubtasks.length > 0 ? (
                    <div className="space-y-2">
                      {taskSubtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium text-text-primary">{subtask.title}</h5>
                              <span className={getStatusBadgeClass(subtask.status)}>
                                {getStatusLabel(subtask.status)}
                              </span>
                            </div>
                            {subtask.description && (
                              <p className="text-sm text-text-secondary mt-1">{subtask.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-text-secondary">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {subtask.startDate && subtask.endDate
                                  ? `${format(parseISO(subtask.startDate), 'MMM d')} - ${format(parseISO(subtask.endDate), 'MMM d, yyyy')}`
                                  : 'No timeline'}
                              </span>
                              {subtask.area && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {subtask.area}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {isAdmin() && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditSubtaskModal(subtask)}
                                className="p-1.5 hover:bg-gray-200 rounded text-text-secondary hover:text-primary"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubtask(subtask.id)}
                                className="p-1.5 hover:bg-red-100 rounded text-text-secondary hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-secondary text-sm">No subtasks yet</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="card text-center py-12">
          <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-text-secondary">No tasks found</p>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTaskModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button onClick={() => setShowTaskModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label htmlFor="projectId" className="label">Project</label>
                <select
                  id="projectId"
                  value={taskForm.projectId}
                  onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="label">Task Title</label>
                <input
                  id="title"
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="label">Description</label>
                <textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="input-field min-h-[80px]"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="label">Priority</label>
                  <select
                    id="priority"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="label">Status</label>
                  <select
                    id="status"
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="dueDate" className="label">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Assigned Users</label>
                <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {allUsers.map(u => (
                    <label key={u.id} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={taskForm.assignedUsers.includes(u.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTaskForm({ ...taskForm, assignedUsers: [...taskForm.assignedUsers, u.id] });
                          } else {
                            setTaskForm({ ...taskForm, assignedUsers: taskForm.assignedUsers.filter(id => id !== u.id) });
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{u.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Saving...' : editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subtask Modal */}
      {showSubtaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSubtaskModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">
                {editingSubtask ? 'Edit Subtask' : 'Create New Subtask'}
              </h2>
              <button onClick={() => setShowSubtaskModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubtaskSubmit} className="space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label htmlFor="subtaskTitle" className="label">Subtask Title</label>
                <input
                  id="subtaskTitle"
                  type="text"
                  value={subtaskForm.title}
                  onChange={(e) => setSubtaskForm({ ...subtaskForm, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter subtask title"
                  required
                />
              </div>

              <div>
                <label htmlFor="subtaskDescription" className="label">Description</label>
                <textarea
                  id="subtaskDescription"
                  value={subtaskForm.description}
                  onChange={(e) => setSubtaskForm({ ...subtaskForm, description: e.target.value })}
                  className="input-field min-h-[80px]"
                  placeholder="Enter subtask description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="label">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    value={subtaskForm.startDate}
                    onChange={(e) => setSubtaskForm({ ...subtaskForm, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="label">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    value={subtaskForm.endDate}
                    onChange={(e) => setSubtaskForm({ ...subtaskForm, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="area" className="label">Area (Location)</label>
                <input
                  id="area"
                  type="text"
                  value={subtaskForm.area}
                  onChange={(e) => setSubtaskForm({ ...subtaskForm, area: e.target.value })}
                  className="input-field"
                  placeholder="Enter location/area"
                />
              </div>

              <div>
                <label htmlFor="subtaskStatus" className="label">Status</label>
                <select
                  id="subtaskStatus"
                  value={subtaskForm.status}
                  onChange={(e) => setSubtaskForm({ ...subtaskForm, status: e.target.value })}
                  className="input-field"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowSubtaskModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Saving...' : editingSubtask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReportModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Submit Status Report</h2>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-text-secondary">Task:</p>
                <p className="font-medium text-text-primary">{reportingTask?.title}</p>
              </div>

              <div>
                <label htmlFor="reportStatus" className="label">Update Status</label>
                <select
                  id="reportStatus"
                  value={reportForm.status}
                  onChange={(e) => setReportForm({ ...reportForm, status: e.target.value })}
                  className="input-field"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="reportText" className="label">Report Details</label>
                <textarea
                  id="reportText"
                  value={reportForm.text}
                  onChange={(e) => setReportForm({ ...reportForm, text: e.target.value })}
                  className="input-field min-h-[120px]"
                  placeholder="Describe the progress, challenges, or updates..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="label">Image Attachment (optional)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    {reportForm.image ? (
                      <div className="relative w-full">
                        <img
                          src={reportForm.image}
                          alt="Preview"
                          className="max-h-40 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setReportForm({ ...reportForm, image: null });
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-text-secondary">
                          Click to upload image (max 5MB)
                        </span>
                        <span className="text-xs text-text-secondary mt-1">
                          JPG, PNG, GIF
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowReportModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;