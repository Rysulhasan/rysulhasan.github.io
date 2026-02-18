// Demo data for NGO Project Management System

export const demoUsers = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@ngo.org',
    password: 'admin123', // In real app, this would be hashed
    role: 'admin',
    avatar: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@ngo.org',
    password: 'employee123',
    role: 'employee',
    avatar: null,
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z'
  },
  {
    id: 'user-3',
    name: 'Michael Chen',
    email: 'michael@ngo.org',
    password: 'employee123',
    role: 'employee',
    avatar: null,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily@ngo.org',
    password: 'employee123',
    role: 'employee',
    avatar: null,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'user-5',
    name: 'James Wilson',
    email: 'james@ngo.org',
    password: 'employee123',
    role: 'employee',
    avatar: null,
    createdAt: '2025-01-20T00:00:00.000Z',
    updatedAt: '2025-01-20T00:00:00.000Z'
  }
];

export const demoProjects = [
  {
    id: 'project-1',
    name: 'Clean Water Initiative',
    description: 'Installing water purification systems in rural communities to provide access to clean and safe drinking water. This initiative targets villages with high waterborne disease rates and limited infrastructure.',
    status: 'active',
    startDate: '2025-01-15',
    endDate: '2026-06-30',
    createdBy: 'user-1',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'project-2',
    name: 'Community Schooling Program',
    description: 'Building and operating community schools in underserved areas. This program focuses on providing quality education to children who lack access to formal schooling due to geographic or economic barriers.',
    status: 'active',
    startDate: '2025-03-01',
    endDate: '2026-12-31',
    createdBy: 'user-1',
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z'
  },
  {
    id: 'project-3',
    name: 'Healthcare Awareness Campaign',
    description: 'Healthcare awareness and preventive medicine workshops aimed at reducing preventable diseases through education and early detection programs.',
    status: 'planning',
    startDate: '2026-02-01',
    endDate: '2026-08-31',
    createdBy: 'user-1',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'project-4',
    name: 'Emergency Relief Response',
    description: 'Emergency food and shelter assistance for communities affected by natural disasters and humanitarian crises. Rapid response team deployment and supply distribution.',
    status: 'on_hold',
    startDate: '2025-11-01',
    endDate: '2026-03-31',
    createdBy: 'user-1',
    createdAt: '2025-11-01T00:00:00.000Z',
    updatedAt: '2025-11-01T00:00:00.000Z'
  }
];

export const demoTasks = [
  // Clean Water Initiative Tasks
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Site Survey - Village A, B, C',
    description: 'Conduct comprehensive site surveys in three target villages to assess water sources, population needs, and infrastructure requirements.',
    priority: 'high',
    status: 'completed',
    assignedUsers: ['user-2', 'user-3'],
    dueDate: '2025-02-28',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-02-28T00:00:00.000Z'
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Equipment Procurement',
    description: 'Source and procure water purification equipment, pipes, and installation materials from verified suppliers.',
    priority: 'urgent',
    status: 'in_progress',
    assignedUsers: ['user-2'],
    dueDate: '2026-03-15',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    title: 'Installation Phase 1',
    description: 'Install water purification systems in Village A and B. Includes pipe laying, system setup, and initial testing.',
    priority: 'high',
    status: 'in_progress',
    assignedUsers: ['user-3', 'user-4'],
    dueDate: '2026-05-30',
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'task-4',
    projectId: 'project-1',
    title: 'Community Training',
    description: 'Train community members on system maintenance, water testing, and basic repairs to ensure sustainability.',
    priority: 'medium',
    status: 'not_started',
    assignedUsers: ['user-5'],
    dueDate: '2026-06-15',
    createdAt: '2025-04-01T00:00:00.000Z',
    updatedAt: '2025-04-01T00:00:00.000Z'
  },
  {
    id: 'task-5',
    projectId: 'project-1',
    title: 'Water Quality Testing',
    description: 'Conduct comprehensive water quality tests before and after installation to verify system effectiveness.',
    priority: 'high',
    status: 'not_started',
    assignedUsers: ['user-2', 'user-5'],
    dueDate: '2026-06-30',
    createdAt: '2025-04-15T00:00:00.000Z',
    updatedAt: '2025-04-15T00:00:00.000Z'
  },
  
  // Community Schooling Program Tasks
  {
    id: 'task-6',
    projectId: 'project-2',
    title: 'Teacher Recruitment',
    description: 'Recruit qualified teachers for various subjects. Includes interviews, background checks, and contract negotiations.',
    priority: 'high',
    status: 'completed',
    assignedUsers: ['user-4'],
    dueDate: '2025-04-30',
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-04-30T00:00:00.000Z'
  },
  {
    id: 'task-7',
    projectId: 'project-2',
    title: 'Curriculum Development',
    description: 'Develop comprehensive curriculum aligned with national standards while incorporating local context and needs.',
    priority: 'high',
    status: 'completed',
    assignedUsers: ['user-4', 'user-5'],
    dueDate: '2025-05-31',
    createdAt: '2025-03-15T00:00:00.000Z',
    updatedAt: '2025-05-31T00:00:00.000Z'
  },
  {
    id: 'task-8',
    projectId: 'project-2',
    title: 'School Construction',
    description: 'Construct school buildings including classrooms, library, and administrative offices. Phase 1: 4 classrooms.',
    priority: 'urgent',
    status: 'in_progress',
    assignedUsers: ['user-3'],
    dueDate: '2026-06-30',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z'
  },
  {
    id: 'task-9',
    projectId: 'project-2',
    title: 'Student Enrollment',
    description: 'Conduct community outreach and enroll students. Target: 200 students in first year across all grade levels.',
    priority: 'high',
    status: 'in_progress',
    assignedUsers: ['user-2', 'user-5'],
    dueDate: '2026-08-31',
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2026-01-25T00:00:00.000Z'
  },
  {
    id: 'task-10',
    projectId: 'project-2',
    title: 'Material Distribution',
    description: 'Distribute educational materials including textbooks, stationery, and uniforms to enrolled students.',
    priority: 'medium',
    status: 'not_started',
    assignedUsers: ['user-4'],
    dueDate: '2026-09-15',
    createdAt: '2025-08-01T00:00:00.000Z',
    updatedAt: '2025-08-01T00:00:00.000Z'
  },
  
  // Healthcare Awareness Campaign Tasks
  {
    id: 'task-11',
    projectId: 'project-3',
    title: 'Campaign Planning',
    description: 'Develop comprehensive campaign strategy including target areas, messaging, and resource allocation.',
    priority: 'high',
    status: 'in_progress',
    assignedUsers: ['user-2'],
    dueDate: '2026-02-28',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'task-12',
    projectId: 'project-3',
    title: 'Material Design',
    description: 'Design educational materials including brochures, posters, and digital content for awareness campaign.',
    priority: 'medium',
    status: 'not_started',
    assignedUsers: ['user-4'],
    dueDate: '2026-03-31',
    createdAt: '2026-01-20T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z'
  },
  {
    id: 'task-13',
    projectId: 'project-3',
    title: 'Partner Coordination',
    description: 'Coordinate with local health departments, hospitals, and community organizations for campaign support.',
    priority: 'high',
    status: 'not_started',
    assignedUsers: ['user-3'],
    dueDate: '2026-04-15',
    createdAt: '2026-01-25T00:00:00.000Z',
    updatedAt: '2026-01-25T00:00:00.000Z'
  },
  {
    id: 'task-14',
    projectId: 'project-3',
    title: 'Field Team Training',
    description: 'Train field workers on health education delivery, screening procedures, and data collection.',
    priority: 'medium',
    status: 'not_started',
    assignedUsers: ['user-5'],
    dueDate: '2026-05-15',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z'
  },
  
  // Emergency Relief Response Tasks
  {
    id: 'task-15',
    projectId: 'project-4',
    title: 'Needs Assessment',
    description: 'Conduct rapid needs assessment in affected areas to determine priority requirements.',
    priority: 'urgent',
    status: 'completed',
    assignedUsers: ['user-2', 'user-3'],
    dueDate: '2025-11-15',
    createdAt: '2025-11-01T00:00:00.000Z',
    updatedAt: '2025-11-15T00:00:00.000Z'
  },
  {
    id: 'task-16',
    projectId: 'project-4',
    title: 'Supply Procurement',
    description: 'Procure emergency supplies including food, water, blankets, and medical kits.',
    priority: 'urgent',
    status: 'completed',
    assignedUsers: ['user-2'],
    dueDate: '2025-11-30',
    createdAt: '2025-11-05T00:00:00.000Z',
    updatedAt: '2025-11-30T00:00:00.000Z'
  },
  {
    id: 'task-17',
    projectId: 'project-4',
    title: 'Distribution Phase 1',
    description: 'Distribute emergency supplies to affected families in priority zones. Target: 500 families.',
    priority: 'urgent',
    status: 'completed',
    assignedUsers: ['user-3', 'user-4', 'user-5'],
    dueDate: '2025-12-31',
    createdAt: '2025-11-15T00:00:00.000Z',
    updatedAt: '2025-12-31T00:00:00.000Z'
  },
  {
    id: 'task-18',
    projectId: 'project-4',
    title: 'Distribution Phase 2',
    description: 'Second phase distribution targeting additional affected areas. Dependent on funding renewal.',
    priority: 'high',
    status: 'not_started',
    assignedUsers: ['user-3', 'user-4'],
    dueDate: '2026-03-31',
    createdAt: '2025-12-01T00:00:00.000Z',
    updatedAt: '2025-12-01T00:00:00.000Z'
  }
];

export const demoSubTasks = [
  // Sub-tasks for Site Survey
  {
    id: 'subtask-1',
    taskId: 'task-1',
    title: 'Village A Survey',
    description: 'Survey water sources, population, and infrastructure in Village A',
    startDate: '2025-01-20',
    endDate: '2025-01-25',
    area: 'Village A, Northern District',
    status: 'completed',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-25T00:00:00.000Z'
  },
  {
    id: 'subtask-2',
    taskId: 'task-1',
    title: 'Village B Survey',
    description: 'Survey water sources, population, and infrastructure in Village B',
    startDate: '2025-01-26',
    endDate: '2025-01-31',
    area: 'Village B, Northern District',
    status: 'completed',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-31T00:00:00.000Z'
  },
  {
    id: 'subtask-3',
    taskId: 'task-1',
    title: 'Village C Survey',
    description: 'Survey water sources, population, and infrastructure in Village C',
    startDate: '2025-02-01',
    endDate: '2025-02-07',
    area: 'Village C, Eastern District',
    status: 'completed',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-02-07T00:00:00.000Z'
  },
  
  // Sub-tasks for Equipment Procurement
  {
    id: 'subtask-4',
    taskId: 'task-2',
    title: 'Supplier Research',
    description: 'Research and shortlist potential suppliers for purification equipment',
    startDate: '2025-02-05',
    endDate: '2025-02-15',
    area: 'Head Office',
    status: 'completed',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z'
  },
  {
    id: 'subtask-5',
    taskId: 'task-2',
    title: 'Quote Collection',
    description: 'Collect and compare quotes from shortlisted suppliers',
    startDate: '2025-02-16',
    endDate: '2025-02-28',
    area: 'Head Office',
    status: 'completed',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-28T00:00:00.000Z'
  },
  {
    id: 'subtask-6',
    taskId: 'task-2',
    title: 'Order Placement',
    description: 'Place orders for approved equipment and materials',
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    area: 'Head Office',
    status: 'in_progress',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'subtask-7',
    taskId: 'task-2',
    title: 'Quality Inspection',
    description: 'Inspect delivered equipment for quality compliance',
    startDate: '2025-03-16',
    endDate: '2025-03-31',
    area: 'Warehouse Facility',
    status: 'not_started',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z'
  },
  
  // Sub-tasks for Installation Phase 1
  {
    id: 'subtask-8',
    taskId: 'task-3',
    title: 'Village A Installation',
    description: 'Install purification system and piping in Village A',
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    area: 'Village A, Northern District',
    status: 'in_progress',
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'subtask-9',
    taskId: 'task-3',
    title: 'Village B Installation',
    description: 'Install purification system and piping in Village B',
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    area: 'Village B, Northern District',
    status: 'not_started',
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z'
  },
  
  // Sub-tasks for School Construction
  {
    id: 'subtask-10',
    taskId: 'task-8',
    title: 'Foundation Work',
    description: 'Complete foundation and structural work for school building',
    startDate: '2025-06-15',
    endDate: '2025-08-15',
    area: 'Community Site, Western Region',
    status: 'completed',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-08-15T00:00:00.000Z'
  },
  {
    id: 'subtask-11',
    taskId: 'task-8',
    title: 'Classroom Construction',
    description: 'Build 4 classrooms with proper ventilation and lighting',
    startDate: '2025-08-16',
    endDate: '2025-12-31',
    area: 'Community Site, Western Region',
    status: 'in_progress',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z'
  },
  {
    id: 'subtask-12',
    taskId: 'task-8',
    title: 'Furnishing',
    description: 'Install furniture, blackboards, and storage in classrooms',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    area: 'Community Site, Western Region',
    status: 'not_started',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'subtask-13',
    taskId: 'task-8',
    title: 'Final Inspection',
    description: 'Conduct final safety and quality inspection before handover',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    area: 'Community Site, Western Region',
    status: 'not_started',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z'
  },
  
  // Sub-tasks for Student Enrollment
  {
    id: 'subtask-14',
    taskId: 'task-9',
    title: 'Community Outreach',
    description: 'Conduct door-to-door awareness campaigns in target communities',
    startDate: '2025-07-15',
    endDate: '2025-08-31',
    area: 'Western Region Villages',
    status: 'completed',
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2025-08-31T00:00:00.000Z'
  },
  {
    id: 'subtask-15',
    taskId: 'task-9',
    title: 'Registration Drive',
    description: 'Set up registration camps and process student applications',
    startDate: '2025-09-01',
    endDate: '2025-10-31',
    area: 'Multiple Locations, Western Region',
    status: 'in_progress',
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2026-01-25T00:00:00.000Z'
  },
  {
    id: 'subtask-16',
    taskId: 'task-9',
    title: 'Verification Process',
    description: 'Verify student documents and eligibility criteria',
    startDate: '2025-11-01',
    endDate: '2025-12-15',
    area: 'Head Office',
    status: 'not_started',
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2025-07-01T00:00:00.000Z'
  },
  
  // Sub-tasks for Campaign Planning
  {
    id: 'subtask-17',
    taskId: 'task-11',
    title: 'Stakeholder Meeting',
    description: 'Conduct initial meeting with key stakeholders and partners',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    area: 'Head Office',
    status: 'in_progress',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'subtask-18',
    taskId: 'task-11',
    title: 'Budget Planning',
    description: 'Develop detailed budget allocation for campaign activities',
    startDate: '2026-02-08',
    endDate: '2026-02-15',
    area: 'Head Office',
    status: 'not_started',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'subtask-19',
    taskId: 'task-11',
    title: 'Timeline Development',
    description: 'Create detailed timeline for campaign phases and milestones',
    startDate: '2026-02-16',
    endDate: '2026-02-28',
    area: 'Head Office',
    status: 'not_started',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z'
  }
];

export const demoReports = [
  {
    id: 'report-1',
    taskId: 'task-1',
    userId: 'user-2',
    status: 'completed',
    text: 'Successfully completed site survey in Village A. Identified 3 potential water sources and surveyed 150 households. Key findings: Main water source is contaminated with bacteria. Population willing to participate in the program.',
    image: null,
    createdAt: '2025-01-25T14:30:00.000Z'
  },
  {
    id: 'report-2',
    taskId: 'task-1',
    userId: 'user-3',
    status: 'completed',
    text: 'Village B survey completed. Found natural spring water source that can be developed. Community has land available for installation site. Estimated 200 beneficiaries.',
    image: null,
    createdAt: '2025-01-31T16:00:00.000Z'
  },
  {
    id: 'report-3',
    taskId: 'task-2',
    userId: 'user-2',
    status: 'in_progress',
    text: 'Received quotes from 5 suppliers. Two suppliers meet quality standards. Negotiating prices for bulk order. Expected 15% discount on original quotes.',
    image: null,
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'report-4',
    taskId: 'task-3',
    userId: 'user-3',
    status: 'in_progress',
    text: 'Installation in Village A progressing well. Main pipeline laid (500m completed). Purification unit foundation ready. Community members assisting with labor.',
    image: null,
    createdAt: '2026-01-15T11:30:00.000Z'
  },
  {
    id: 'report-5',
    taskId: 'task-6',
    userId: 'user-4',
    status: 'completed',
    text: 'Teacher recruitment completed. Hired 8 qualified teachers covering Math, Science, Language Arts, and Social Studies. All teachers have completed orientation and are ready for school opening.',
    image: null,
    createdAt: '2025-04-30T15:00:00.000Z'
  },
  {
    id: 'report-6',
    taskId: 'task-7',
    userId: 'user-5',
    status: 'completed',
    text: 'Curriculum development finalized. Created comprehensive syllabus for grades 1-5. Incorporated local history and environmental awareness modules. Materials printed and ready for distribution.',
    image: null,
    createdAt: '2025-05-31T17:00:00.000Z'
  },
  {
    id: 'report-7',
    taskId: 'task-8',
    userId: 'user-3',
    status: 'in_progress',
    text: 'Construction update: Foundation 100% complete. Walls up for all 4 classrooms. Roof installation in progress. Electrical wiring being installed. On track for March completion.',
    image: null,
    createdAt: '2026-01-20T09:00:00.000Z'
  },
  {
    id: 'report-8',
    taskId: 'task-9',
    userId: 'user-2',
    status: 'in_progress',
    text: 'Registration drive ongoing. Currently have 145 students registered. Target communities responding well. Need additional outreach in remote hamlets to reach 200 target.',
    image: null,
    createdAt: '2026-01-25T13:00:00.000Z'
  },
  {
    id: 'report-9',
    taskId: 'task-15',
    userId: 'user-2',
    status: 'completed',
    text: 'Needs assessment completed in 3 affected zones. Priority needs identified: Food supplies, temporary shelter, clean water, and medical supplies. Total affected families: 750.',
    image: null,
    createdAt: '2025-11-15T12:00:00.000Z'
  },
  {
    id: 'report-10',
    taskId: 'task-17',
    userId: 'user-3',
    status: 'completed',
    text: 'Phase 1 distribution completed. Distributed supplies to 500 families across 3 zones. Each family received: 2 weeks food supply, blankets, water containers, and basic medical kit. No major issues encountered.',
    image: null,
    createdAt: '2025-12-31T18:00:00.000Z'
  }
];