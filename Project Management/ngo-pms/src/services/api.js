// Mock API Service with localStorage persistence
import { demoUsers, demoProjects, demoTasks, demoSubTasks, demoReports } from '../data/demoData';

const STORAGE_KEYS = {
  USERS: 'ngo_pms_users',
  PROJECTS: 'ngo_pms_projects',
  TASKS: 'ngo_pms_tasks',
  SUBTASKS: 'ngo_pms_subtasks',
  REPORTS: 'ngo_pms_reports',
  CURRENT_USER: 'ngo_pms_current_user',
  AUTH_TOKEN: 'ngo_pms_auth_token',
  INITIALIZED: 'ngo_pms_initialized'
};

// Initialize demo data if not already done
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(demoProjects));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(demoTasks));
    localStorage.setItem(STORAGE_KEYS.SUBTASKS, JSON.stringify(demoSubTasks));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(demoReports));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
};

// Helper functions
const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize on load
initializeData();

// ==================== AUTH API ====================

export const authAPI = {
  async login(email, password) {
    await delay(300);
    const users = getData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `token-${Date.now()}-${user.id}`;
    const { password: _, ...userWithoutPassword } = user;
    
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    return {
      user: userWithoutPassword,
      token
    };
  },
  
  async logout() {
    await delay(200);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { success: true };
  },
  
  async getCurrentUser() {
    await delay(100);
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userJson) {
      return null;
    }
    return JSON.parse(userJson);
  },
  
  async updatePassword(userId, currentPassword, newPassword) {
    await delay(300);
    const users = getData(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    if (users[userIndex].password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    setData(STORAGE_KEYS.USERS, users);
    
    return { success: true };
  }
};

// ==================== USERS API ====================

export const usersAPI = {
  async getAll() {
    await delay(200);
    const users = getData(STORAGE_KEYS.USERS);
    return users.map(({ password, ...user }) => user);
  },
  
  async getById(id) {
    await delay(100);
    const users = getData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  async create(userData) {
    await delay(300);
    const users = getData(STORAGE_KEYS.USERS);
    
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      id: generateId('user'),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'employee',
      avatar: userData.avatar || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    setData(STORAGE_KEYS.USERS, users);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  async update(id, userData) {
    await delay(300);
    const users = getData(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Check email uniqueness if email is being changed
    if (userData.email && userData.email !== users[userIndex].email) {
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    setData(STORAGE_KEYS.USERS, users);
    
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  },
  
  async delete(id) {
    await delay(300);
    const users = getData(STORAGE_KEYS.USERS);
    const filteredUsers = users.filter(u => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }
    
    setData(STORAGE_KEYS.USERS, filteredUsers);
    return { success: true };
  },
  
  async updateProfile(userId, profileData) {
    await delay(300);
    const users = getData(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Check email uniqueness if email is being changed
    if (profileData.email && profileData.email !== users[userIndex].email) {
      if (users.some(u => u.email === profileData.email)) {
        throw new Error('Email already exists');
      }
    }
    
    users[userIndex] = {
      ...users[userIndex],
      name: profileData.name || users[userIndex].name,
      email: profileData.email || users[userIndex].email,
      updatedAt: new Date().toISOString()
    };
    
    setData(STORAGE_KEYS.USERS, users);
    
    // Update current user in session
    const { password, ...userWithoutPassword } = users[userIndex];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  }
};

// ==================== PROJECTS API ====================

export const projectsAPI = {
  async getAll() {
    await delay(200);
    return getData(STORAGE_KEYS.PROJECTS);
  },
  
  async getById(id) {
    await delay(100);
    const projects = getData(STORAGE_KEYS.PROJECTS);
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  },
  
  async create(projectData) {
    await delay(300);
    const projects = getData(STORAGE_KEYS.PROJECTS);
    
    const newProject = {
      id: generateId('project'),
      name: projectData.name,
      description: projectData.description || '',
      status: projectData.status || 'planning',
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      createdBy: projectData.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    setData(STORAGE_KEYS.PROJECTS, projects);
    return newProject;
  },
  
  async update(id, projectData) {
    await delay(300);
    const projects = getData(STORAGE_KEYS.PROJECTS);
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    
    setData(STORAGE_KEYS.PROJECTS, projects);
    return projects[projectIndex];
  },
  
  async delete(id) {
    await delay(300);
    const projects = getData(STORAGE_KEYS.PROJECTS);
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) {
      throw new Error('Project not found');
    }
    
    // Also delete related tasks and subtasks
    const tasks = getData(STORAGE_KEYS.TASKS);
    const projectTasks = tasks.filter(t => t.projectId === id);
    const taskIds = projectTasks.map(t => t.id);
    
    const remainingTasks = tasks.filter(t => t.projectId !== id);
    setData(STORAGE_KEYS.TASKS, remainingTasks);
    
    const subtasks = getData(STORAGE_KEYS.SUBTASKS);
    const remainingSubtasks = subtasks.filter(st => !taskIds.includes(st.taskId));
    setData(STORAGE_KEYS.SUBTASKS, remainingSubtasks);
    
    // Delete related reports
    const reports = getData(STORAGE_KEYS.REPORTS);
    const remainingReports = reports.filter(r => !taskIds.includes(r.taskId));
    setData(STORAGE_KEYS.REPORTS, remainingReports);
    
    setData(STORAGE_KEYS.PROJECTS, filteredProjects);
    return { success: true };
  }
};

// ==================== TASKS API ====================

export const tasksAPI = {
  async getAll(filters = {}) {
    await delay(200);
    let tasks = getData(STORAGE_KEYS.TASKS);
    
    if (filters.projectId) {
      tasks = tasks.filter(t => t.projectId === filters.projectId);
    }
    if (filters.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    if (filters.priority) {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }
    if (filters.assignedUserId) {
      tasks = tasks.filter(t => t.assignedUsers.includes(filters.assignedUserId));
    }
    
    return tasks;
  },
  
  async getById(id) {
    await delay(100);
    const tasks = getData(STORAGE_KEYS.TASKS);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },
  
  async create(taskData) {
    await delay(300);
    const tasks = getData(STORAGE_KEYS.TASKS);
    
    const newTask = {
      id: generateId('task'),
      projectId: taskData.projectId,
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'not_started',
      assignedUsers: taskData.assignedUsers || [],
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    setData(STORAGE_KEYS.TASKS, tasks);
    return newTask;
  },
  
  async update(id, taskData) {
    await delay(300);
    const tasks = getData(STORAGE_KEYS.TASKS);
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    setData(STORAGE_KEYS.TASKS, tasks);
    return tasks[taskIndex];
  },
  
  async delete(id) {
    await delay(300);
    const tasks = getData(STORAGE_KEYS.TASKS);
    const filteredTasks = tasks.filter(t => t.id !== id);
    
    if (filteredTasks.length === tasks.length) {
      throw new Error('Task not found');
    }
    
    // Delete related subtasks
    const subtasks = getData(STORAGE_KEYS.SUBTASKS);
    const remainingSubtasks = subtasks.filter(st => st.taskId !== id);
    setData(STORAGE_KEYS.SUBTASKS, remainingSubtasks);
    
    // Delete related reports
    const reports = getData(STORAGE_KEYS.REPORTS);
    const remainingReports = reports.filter(r => r.taskId !== id);
    setData(STORAGE_KEYS.REPORTS, remainingReports);
    
    setData(STORAGE_KEYS.TASKS, filteredTasks);
    return { success: true };
  },
  
  async updateStatus(id, status) {
    await delay(200);
    return this.update(id, { status });
  }
};

// ==================== SUBTASKS API ====================

export const subtasksAPI = {
  async getByTaskId(taskId) {
    await delay(100);
    const subtasks = getData(STORAGE_KEYS.SUBTASKS);
    return subtasks.filter(st => st.taskId === taskId);
  },
  
  async getById(id) {
    await delay(100);
    const subtasks = getData(STORAGE_KEYS.SUBTASKS);
    const subtask = subtasks.find(st => st.id === id);
    if (!subtask) {
      throw new Error('Subtask not found');
    }
    return subtask;
  },
  
  async create(subtaskData) {
    await delay(300);
    const subtasks = getData(STORAGE_KEYS.SUBTASKS);
    
    const newSubtask = {
      id: generateId('subtask'),
      taskId: subtaskData.taskId,
      title: subtaskData.title,
      description: subtaskData.description || '',
      startDate: subtaskData.startDate,
      endDate: subtaskData.endDate,
      area: subtaskData.area || '',
      status: subtaskData.status || 'not_started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    subtasks.push(newSubtask);
    setData(STORAGE_KEYS.SUBTASKS, subtasks);
    return newSubtask;
  },
  
  async update(id, subtaskData) {
    await delay(300);
    const subtasks = getData(STORAGE_KEYS.SUBTASKS);
    const subtaskIndex = subtasks.findIndex(st => st.id === id);
    
    if (subtaskIndex === -1) {
      throw new Error('Subtask not found');
    }
    
    subtasks[subtaskIndex] = {
      ...subtasks[subtaskIndex],
      ...subtaskData,
      updatedAt: new Date().toISOString()
    };
    
    setData(STORAGE_KEYS.SUBTASKS, subtasks);
    return subtasks[subtaskIndex];
  },
  
  async delete(id) {
    await delay(300);
    const subtasks = getData(STORAGE_KEYS.SUBTASKS);
    const filteredSubtasks = subtasks.filter(st => st.id !== id);
    
    if (filteredSubtasks.length === subtasks.length) {
      throw new Error('Subtask not found');
    }
    
    setData(STORAGE_KEYS.SUBTASKS, filteredSubtasks);
    return { success: true };
  }
};

// ==================== REPORTS API ====================

export const reportsAPI = {
  async getAll(filters = {}) {
    await delay(200);
    let reports = getData(STORAGE_KEYS.REPORTS);
    
    if (filters.taskId) {
      reports = reports.filter(r => r.taskId === filters.taskId);
    }
    if (filters.userId) {
      reports = reports.filter(r => r.userId === filters.userId);
    }
    
    // Sort by createdAt descending
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return reports;
  },
  
  async getById(id) {
    await delay(100);
    const reports = getData(STORAGE_KEYS.REPORTS);
    const report = reports.find(r => r.id === id);
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  },
  
  async create(reportData) {
    await delay(300);
    const reports = getData(STORAGE_KEYS.REPORTS);
    
    const newReport = {
      id: generateId('report'),
      taskId: reportData.taskId,
      userId: reportData.userId,
      status: reportData.status,
      text: reportData.text,
      image: reportData.image || null,
      createdAt: new Date().toISOString()
    };
    
    reports.push(newReport);
    setData(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  },
  
  async delete(id) {
    await delay(300);
    const reports = getData(STORAGE_KEYS.REPORTS);
    const filteredReports = reports.filter(r => r.id !== id);
    
    if (filteredReports.length === reports.length) {
      throw new Error('Report not found');
    }
    
    setData(STORAGE_KEYS.REPORTS, filteredReports);
    return { success: true };
  }
};

// ==================== STATS API ====================

export const statsAPI = {
  async getDashboardStats(userId = null, role = 'employee') {
    await delay(200);
    const projects = getData(STORAGE_KEYS.PROJECTS);
    const tasks = getData(STORAGE_KEYS.TASKS);
    const subtasks = getData(STORAGE_KEYS.SUBTASKS);
    const reports = getData(STORAGE_KEYS.REPORTS);
    
    let userTasks = tasks;
    if (role === 'employee' && userId) {
      userTasks = tasks.filter(t => t.assignedUsers.includes(userId));
    }
    
    const tasksByStatus = {
      not_started: userTasks.filter(t => t.status === 'not_started').length,
      in_progress: userTasks.filter(t => t.status === 'in_progress').length,
      completed: userTasks.filter(t => t.status === 'completed').length
    };
    
    const tasksByPriority = {
      low: userTasks.filter(t => t.priority === 'low').length,
      medium: userTasks.filter(t => t.priority === 'medium').length,
      high: userTasks.filter(t => t.priority === 'high').length,
      urgent: userTasks.filter(t => t.priority === 'urgent').length
    };
    
    const projectsByStatus = {
      planning: projects.filter(p => p.status === 'planning').length,
      active: projects.filter(p => p.status === 'active').length,
      on_hold: projects.filter(p => p.status === 'on_hold').length,
      completed: projects.filter(p => p.status === 'completed').length
    };
    
    const recentReports = reports
      .filter(r => role === 'admin' || userTasks.some(t => t.id === r.taskId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    return {
      totalProjects: role === 'admin' ? projects.length : [...new Set(userTasks.map(t => t.projectId))].length,
      totalTasks: userTasks.length,
      tasksByStatus,
      tasksByPriority,
      projectsByStatus,
      recentReports
    };
  }
};

// Reset to demo data
export const resetToDemo = () => {
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.SUBTASKS);
  localStorage.removeItem(STORAGE_KEYS.REPORTS);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  initializeData();
  return { success: true };
};