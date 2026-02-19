import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, tasksAPI, taskHeadsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  FolderKanban,
  Calendar,
  CheckSquare,
  AlertCircle,
  Tag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [projectTaskHeads, setProjectTaskHeads] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showTaskHeadsModal, setShowTaskHeadsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    endDate: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Task head form state
  const [taskHeads, setTaskHeads] = useState([]);
  const [editingTaskHead, setEditingTaskHead] = useState(null);
  const [taskHeadForm, setTaskHeadForm] = useState({
    name: '',
    color: '#3B82F6',
    description: ''
  });
  const [expandedProjects, setExpandedProjects] = useState({});

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const [projectsData, tasksData, taskHeadsData] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getAll(),
        taskHeadsAPI.getAll()
      ]);
      setProjects(projectsData);
      
      // Group tasks by project
      const tasksByProject = {};
      tasksData.forEach(task => {
        if (!tasksByProject[task.projectId]) {
          tasksByProject[task.projectId] = [];
        }
        tasksByProject[task.projectId].push(task);
      });
      setProjectTasks(tasksByProject);
      
      // Group task heads by project
      const headsByProject = {};
      taskHeadsData.forEach(head => {
        if (!headsByProject[head.projectId]) {
          headsByProject[head.projectId] = [];
        }
        headsByProject[head.projectId].push(head);
      });
      setProjectTaskHeads(headsByProject);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      startDate: '',
      endDate: ''
    });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      startDate: '',
      endDate: ''
    });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingProject) {
        await projectsAPI.update(editingProject.id, formData);
      } else {
        await projectsAPI.create({
          ...formData,
          createdBy: 'user-1' // Admin ID
        });
      }
      await loadProjects();
      closeModal();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId) => {
    const tasks = projectTasks[projectId] || [];
    const hasIncompleteTasks = tasks.some(t => t.status !== 'completed');
    
    let message = 'Are you sure you want to delete this project?';
    if (hasIncompleteTasks) {
      message += `\n\nWarning: This project has incomplete tasks that will also be deleted.`;
    }

    if (window.confirm(message)) {
      try {
        await projectsAPI.delete(projectId);
        await loadProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert('Failed to delete project');
      }
    }
  };

  // Task Heads Management
  const openTaskHeadsModal = async (project) => {
    setSelectedProject(project);
    const heads = await taskHeadsAPI.getAll({ projectId: project.id });
    setTaskHeads(heads);
    setEditingTaskHead(null);
    setTaskHeadForm({
      name: '',
      color: '#3B82F6',
      description: ''
    });
    setShowTaskHeadsModal(true);
  };

  const closeTaskHeadsModal = () => {
    setShowTaskHeadsModal(false);
    setSelectedProject(null);
    setTaskHeads([]);
    setEditingTaskHead(null);
  };

  const handleTaskHeadSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskHead) {
        await taskHeadsAPI.update(editingTaskHead.id, taskHeadForm);
      } else {
        await taskHeadsAPI.create({
          ...taskHeadForm,
          projectId: selectedProject.id
        });
      }
      const heads = await taskHeadsAPI.getAll({ projectId: selectedProject.id });
      setTaskHeads(heads);
      setEditingTaskHead(null);
      setTaskHeadForm({
        name: '',
        color: '#3B82F6',
        description: ''
      });
      await loadProjects();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTaskHeadDelete = async (headId) => {
    if (window.confirm('Are you sure you want to delete this task head? Tasks under this head will be unassigned.')) {
      try {
        await taskHeadsAPI.delete(headId);
        const heads = await taskHeadsAPI.getAll({ projectId: selectedProject.id });
        setTaskHeads(heads);
        await loadProjects();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const startEditTaskHead = (head) => {
    setEditingTaskHead(head);
    setTaskHeadForm({
      name: head.name,
      color: head.color,
      description: head.description || ''
    });
  };

  const cancelEditTaskHead = () => {
    setEditingTaskHead(null);
    setTaskHeadForm({
      name: '',
      color: '#3B82F6',
      description: ''
    });
  };

  const toggleProjectExpand = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      planning: 'badge-info',
      active: 'badge-primary',
      on_hold: 'badge-warning',
      completed: 'badge-success'
    };
    return classes[status] || 'badge-info';
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getProjectProgress = (projectId) => {
    const tasks = projectTasks[projectId] || [];
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Color options for task heads
  const colorOptions = [
    { value: '#3B82F6', label: 'Blue' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#EF4444', label: 'Red' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#06B6D4', label: 'Cyan' },
    { value: '#6366F1', label: 'Indigo' }
  ];

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
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary mt-1">Manage your organization's projects</p>
        </div>
        {isAdmin() && (
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Project
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
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map((project) => {
          const tasks = projectTasks[project.id] || [];
          const heads = projectTaskHeads[project.id] || [];
          const progress = getProjectProgress(project.id);
          const isExpanded = expandedProjects[project.id];
          
          return (
            <div key={project.id} className="card hover:shadow-md transition-shadow">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-text-primary text-lg">
                      {project.name}
                    </h3>
                    <span className={getStatusBadgeClass(project.status)}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {project.description}
                  </p>
                </div>
                {isAdmin() && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-text-secondary hover:text-primary"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-text-secondary hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-secondary">Progress</span>
                  <span className="font-medium text-text-primary">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                <div className="flex items-center gap-1">
                  <CheckSquare className="w-4 h-4" />
                  <span>{tasks.length} tasks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{heads.length} task heads</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Ends {format(parseISO(project.endDate), 'MMM d, yyyy')}</span>
                </div>
              </div>

              {/* Task Heads Preview */}
              {heads.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {heads.slice(0, 4).map(head => (
                      <span
                        key={head.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${head.color}20`, 
                          color: head.color 
                        }}
                      >
                        {head.name}
                        <span className="ml-1 text-gray-500">
                          ({tasks.filter(t => t.taskHeadId === head.id).length})
                        </span>
                      </span>
                    ))}
                    {heads.length > 4 && (
                      <span className="text-xs text-text-secondary">
                        +{heads.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Expandable Task Heads Section */}
              {isExpanded && (
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <h4 className="text-sm font-medium text-text-primary mb-3">Task Heads & Tasks</h4>
                  <div className="space-y-3">
                    {heads.map(head => {
                      const headTasks = tasks.filter(t => t.taskHeadId === head.id);
                      const unassignedTasks = tasks.filter(t => !t.taskHeadId);
                      
                      return (
                        <div key={head.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: head.color }}
                              />
                              <span className="font-medium text-text-primary">{head.name}</span>
                              <span className="text-xs text-text-secondary">
                                ({headTasks.length} tasks)
                              </span>
                            </div>
                            <span className="text-xs text-text-secondary">
                              {head.description}
                            </span>
                          </div>
                          <div className="pl-5 space-y-1">
                            {headTasks.slice(0, 3).map(task => (
                              <div key={task.id} className="flex items-center gap-2 text-sm">
                                <span className={`w-2 h-2 rounded-full ${
                                  task.status === 'completed' ? 'bg-green-500' :
                                  task.status === 'in_progress' ? 'bg-blue-500' :
                                  'bg-gray-300'
                                }`} />
                                <span className="text-text-secondary">{task.title}</span>
                              </div>
                            ))}
                            {headTasks.length > 3 && (
                              <span className="text-xs text-text-secondary pl-2">
                                +{headTasks.length - 3} more tasks
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {/* Unassigned tasks */}
                    {tasks.filter(t => !t.taskHeadId).length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                          <span className="font-medium text-text-secondary">Unassigned</span>
                          <span className="text-xs text-text-secondary">
                            ({tasks.filter(t => !t.taskHeadId).length} tasks)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleProjectExpand(project.id)}
                  className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show task heads
                    </>
                  )}
                </button>
                {isAdmin() && (
                  <button
                    onClick={() => openTaskHeadsModal(project)}
                    className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1"
                  >
                    <Tag className="w-4 h-4" />
                    Manage Heads
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="card text-center py-12">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-text-secondary">No projects found</p>
        </div>
      )}

      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label htmlFor="name" className="label">
                  Project Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="label">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="label">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1"
                >
                  {submitting ? 'Saving...' : editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Heads Modal */}
      {showTaskHeadsModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeTaskHeadsModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">
                Task Heads - {selectedProject.name}
              </h2>
              <button
                onClick={closeTaskHeadsModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add/Edit Form */}
            <form onSubmit={handleTaskHeadSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-text-primary mb-3">
                {editingTaskHead ? 'Edit Task Head' : 'Add New Task Head'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name</label>
                  <input
                    type="text"
                    value={taskHeadForm.name}
                    onChange={(e) => setTaskHeadForm({ ...taskHeadForm, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Planning, Execution, Review"
                    required
                  />
                </div>
                <div>
                  <label className="label">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setTaskHeadForm({ ...taskHeadForm, color: color.value })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          taskHeadForm.color === color.value ? 'border-gray-800 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="label">Description (optional)</label>
                <input
                  type="text"
                  value={taskHeadForm.description}
                  onChange={(e) => setTaskHeadForm({ ...taskHeadForm, description: e.target.value })}
                  className="input-field"
                  placeholder="Brief description of this task head"
                />
              </div>
              <div className="flex gap-2 mt-4">
                {editingTaskHead && (
                  <button
                    type="button"
                    onClick={cancelEditTaskHead}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary">
                  {editingTaskHead ? 'Update' : 'Add Task Head'}
                </button>
              </div>
            </form>

            {/* Task Heads List */}
            <div className="space-y-3">
              {taskHeads.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No task heads yet. Add one above to organize tasks.</p>
                </div>
              ) : (
                taskHeads.map((head, index) => {
                  const headTasks = (projectTasks[selectedProject.id] || []).filter(t => t.taskHeadId === head.id);
                  return (
                    <div
                      key={head.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: head.color }}
                        />
                        <div>
                          <span className="font-medium text-text-primary">{head.name}</span>
                          {head.description && (
                            <p className="text-sm text-text-secondary">{head.description}</p>
                          )}
                          <p className="text-xs text-text-secondary mt-1">
                            {headTasks.length} task{headTasks.length !== 1 ? 's' : ''} assigned
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditTaskHead(head)}
                          className="p-2 hover:bg-gray-200 rounded-lg text-text-secondary hover:text-primary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleTaskHeadDelete(head.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-text-secondary hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;