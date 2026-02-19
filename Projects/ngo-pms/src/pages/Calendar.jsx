import { useState, useEffect, useMemo } from 'react';
import { tasksAPI, projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, startOfWeek, endOfWeek, addDays } from 'date-fns';

const CalendarPage = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        tasksAPI.getAll(isAdmin() ? {} : { assignedUserId: user?.id }),
        projectsAPI.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectColor = (projectId) => {
    const colors = [
      '#0D9488', // primary teal
      '#F97316', // orange
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#14B8A6', // cyan
      '#F59E0B', // amber
      '#EF4444', // red
    ];
    const index = projects.findIndex(p => p.id === projectId);
    return colors[index % colors.length];
  };

  const getProjectName = (projectId) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown';
  };

  // Create calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = [];
    let day = startDate;
    
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    return days;
  }, [currentDate]);

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = parseISO(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  // Get project deadlines for a specific date
  const getProjectDeadlinesForDate = (date) => {
    return projects.filter(project => {
      if (!project.endDate) return false;
      const projectDate = parseISO(project.endDate);
      return isSameDay(projectDate, date);
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedDateDeadlines = selectedDate ? getProjectDeadlinesForDate(selectedDate) : [];

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
        <h1 className="text-2xl font-bold text-text-primary">Calendar</h1>
        <p className="text-text-secondary mt-1">View project timelines and task deadlines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  Today
                </button>
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-text-secondary py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayTasks = getTasksForDate(day);
                const dayDeadlines = getProjectDeadlinesForDate(day);
                const hasItems = dayTasks.length > 0 || dayDeadlines.length > 0;
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative min-h-[80px] p-2 rounded-lg text-left transition-colors
                      ${isCurrentMonth ? 'text-text-primary' : 'text-gray-400'}
                      ${isSelected ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-gray-50'}
                      ${isTodayDate && !isSelected ? 'bg-primary/5' : ''}
                    `}
                  >
                    <span
                      className={`
                        text-sm font-medium
                        ${isTodayDate ? 'text-primary' : ''}
                      `}
                    >
                      {format(day, 'd')}
                    </span>
                    
                    {hasItems && (
                      <div className="mt-1 space-y-0.5">
                        {dayDeadlines.slice(0, 1).map((project) => (
                          <div
                            key={project.id}
                            className="text-xs px-1.5 py-0.5 rounded truncate"
                            style={{
                              backgroundColor: getProjectColor(project.id) + '20',
                              color: getProjectColor(project.id)
                            }}
                          >
                            {project.name}
                          </div>
                        ))}
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className="text-xs px-1.5 py-0.5 rounded truncate bg-gray-100 text-text-secondary"
                          >
                            {task.title}
                          </div>
                        ))}
                        {(dayTasks.length + dayDeadlines.length) > 3 && (
                          <div className="text-xs text-text-secondary px-1">
                            +{dayTasks.length + dayDeadlines.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-text-secondary">Project Deadline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-300" />
                  <span className="text-text-secondary">Task Due Date</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold text-text-primary mb-4">
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
            </h3>

            {!selectedDate ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-text-secondary text-sm">
                  Click on a date to view details
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Project Deadlines */}
                {selectedDateDeadlines.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">
                      Project Deadlines
                    </h4>
                    <div className="space-y-2">
                      {selectedDateDeadlines.map((project) => (
                        <div
                          key={project.id}
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: getProjectColor(project.id) + '10'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getProjectColor(project.id) }}
                            />
                            <span className="font-medium text-text-primary">
                              {project.name}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks */}
                {selectedDateTasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">
                      Tasks Due
                    </h4>
                    <div className="space-y-2">
                      {selectedDateTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-text-primary">
                              {task.title}
                            </span>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: task.status === 'completed' 
                                  ? '#22C55E20' 
                                  : task.status === 'in_progress' 
                                    ? '#3B82F620' 
                                    : '#64748B20',
                                color: task.status === 'completed' 
                                  ? '#22C55E' 
                                  : task.status === 'in_progress' 
                                    ? '#3B82F6' 
                                    : '#64748B'
                              }}
                            >
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-1">
                            {getProjectName(task.projectId)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className="badge text-xs"
                              style={{
                                backgroundColor: task.priority === 'urgent'
                                  ? '#EF444420'
                                  : task.priority === 'high'
                                    ? '#F9731620'
                                    : task.priority === 'medium'
                                      ? '#F59E0B20'
                                      : '#22C55E20',
                                color: task.priority === 'urgent'
                                  ? '#EF4444'
                                  : task.priority === 'high'
                                    ? '#F97316'
                                    : task.priority === 'medium'
                                      ? '#F59E0B'
                                      : '#22C55E'
                              }}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDateDeadlines.length === 0 && selectedDateTasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-text-secondary text-sm">
                      No tasks or deadlines on this date
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;