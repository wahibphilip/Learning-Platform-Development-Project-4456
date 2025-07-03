import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [paths, setPaths] = useState([]);
  const [exams, setExams] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    // Initialize with comprehensive mock data
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Generate comprehensive course data
    const mockCourses = [
      // Frontend Development Courses
      {
        id: '1',
        title: 'HTML & CSS Fundamentals',
        description: 'Master the building blocks of web development with HTML and CSS',
        instructor: 'Sarah Mitchell',
        duration: '3 weeks',
        level: 'Beginner',
        price: 199,
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
        enrolled: 1245,
        rating: 4.8,
        status: 'active',
        category: 'Frontend'
      },
      {
        id: '2',
        title: 'JavaScript Essentials',
        description: 'Learn modern JavaScript programming from basics to advanced concepts',
        instructor: 'Mike Johnson',
        duration: '4 weeks',
        level: 'Beginner',
        price: 249,
        image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop',
        enrolled: 987,
        rating: 4.9,
        status: 'active',
        category: 'Frontend'
      },
      {
        id: '3',
        title: 'React Fundamentals',
        description: 'Build dynamic user interfaces with React library',
        instructor: 'Emily Chen',
        duration: '5 weeks',
        level: 'Intermediate',
        price: 299,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
        enrolled: 756,
        rating: 4.7,
        status: 'active',
        category: 'Frontend'
      },
      {
        id: '4',
        title: 'Advanced React Patterns',
        description: 'Master advanced React concepts, hooks, and state management',
        instructor: 'David Rodriguez',
        duration: '6 weeks',
        level: 'Advanced',
        price: 399,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
        enrolled: 432,
        rating: 4.9,
        status: 'active',
        category: 'Frontend'
      },
      {
        id: '5',
        title: 'Vue.js Complete Guide',
        description: 'Comprehensive Vue.js course from beginner to advanced',
        instructor: 'Lisa Wang',
        duration: '5 weeks',
        level: 'Intermediate',
        price: 279,
        image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop',
        enrolled: 543,
        rating: 4.6,
        status: 'active',
        category: 'Frontend'
      },

      // Backend Development Courses
      {
        id: '6',
        title: 'Node.js Fundamentals',
        description: 'Server-side JavaScript development with Node.js',
        instructor: 'Alex Thompson',
        duration: '4 weeks',
        level: 'Intermediate',
        price: 279,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
        enrolled: 678,
        rating: 4.8,
        status: 'active',
        category: 'Backend'
      },
      {
        id: '7',
        title: 'Express.js & APIs',
        description: 'Build RESTful APIs and web applications with Express.js',
        instructor: 'Maria Garcia',
        duration: '4 weeks',
        level: 'Intermediate',
        price: 299,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
        enrolled: 567,
        rating: 4.7,
        status: 'active',
        category: 'Backend'
      },
      {
        id: '8',
        title: 'Database Design & MongoDB',
        description: 'Design and work with NoSQL databases using MongoDB',
        instructor: 'Robert Kim',
        duration: '3 weeks',
        level: 'Intermediate',
        price: 249,
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
        enrolled: 445,
        rating: 4.6,
        status: 'active',
        category: 'Backend'
      },
      {
        id: '9',
        title: 'Python Web Development',
        description: 'Build web applications with Python and Django',
        instructor: 'Jennifer Lee',
        duration: '6 weeks',
        level: 'Intermediate',
        price: 349,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
        enrolled: 789,
        rating: 4.8,
        status: 'active',
        category: 'Backend'
      },

      // Full Stack Courses
      {
        id: '10',
        title: 'Full Stack JavaScript',
        description: 'Complete MERN stack development course',
        instructor: 'Kevin Park',
        duration: '8 weeks',
        level: 'Advanced',
        price: 499,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
        enrolled: 234,
        rating: 4.9,
        status: 'active',
        category: 'Full Stack'
      },
      {
        id: '11',
        title: 'MEAN Stack Development',
        description: 'MongoDB, Express, Angular, and Node.js development',
        instructor: 'Angela Davis',
        duration: '8 weeks',
        level: 'Advanced',
        price: 479,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
        enrolled: 198,
        rating: 4.7,
        status: 'active',
        category: 'Full Stack'
      },

      // DevOps & Deployment
      {
        id: '12',
        title: 'Docker & Containerization',
        description: 'Master containerization with Docker and Docker Compose',
        instructor: 'Thomas Anderson',
        duration: '3 weeks',
        level: 'Intermediate',
        price: 229,
        image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop',
        enrolled: 456,
        rating: 4.8,
        status: 'active',
        category: 'DevOps'
      },
      {
        id: '13',
        title: 'AWS Cloud Fundamentals',
        description: 'Deploy and manage applications on Amazon Web Services',
        instructor: 'Sandra Miller',
        duration: '5 weeks',
        level: 'Intermediate',
        price: 379,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
        enrolled: 567,
        rating: 4.9,
        status: 'active',
        category: 'DevOps'
      },
      {
        id: '14',
        title: 'CI/CD with GitHub Actions',
        description: 'Automate your deployment pipeline with GitHub Actions',
        instructor: 'James Wilson',
        duration: '2 weeks',
        level: 'Advanced',
        price: 199,
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250&fit=crop',
        enrolled: 234,
        rating: 4.7,
        status: 'active',
        category: 'DevOps'
      },

      // Mobile Development
      {
        id: '15',
        title: 'React Native Mobile Apps',
        description: 'Build cross-platform mobile apps with React Native',
        instructor: 'Nina Patel',
        duration: '6 weeks',
        level: 'Advanced',
        price: 399,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
        enrolled: 345,
        rating: 4.8,
        status: 'active',
        category: 'Mobile'
      },
      {
        id: '16',
        title: 'Flutter Development',
        description: 'Create beautiful mobile apps with Google\'s Flutter framework',
        instructor: 'Carlos Santos',
        duration: '7 weeks',
        level: 'Advanced',
        price: 429,
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop',
        enrolled: 287,
        rating: 4.6,
        status: 'active',
        category: 'Mobile'
      },

      // Data Science & AI
      {
        id: '17',
        title: 'Python for Data Science',
        description: 'Data analysis and visualization with Python, Pandas, and NumPy',
        instructor: 'Dr. Rachel Green',
        duration: '5 weeks',
        level: 'Intermediate',
        price: 329,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
        enrolled: 678,
        rating: 4.9,
        status: 'active',
        category: 'Data Science'
      },
      {
        id: '18',
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning algorithms and applications',
        instructor: 'Dr. Michael Brown',
        duration: '6 weeks',
        level: 'Advanced',
        price: 449,
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
        enrolled: 234,
        rating: 4.8,
        status: 'active',
        category: 'Data Science'
      }
    ];

    // Generate learning paths with course overlaps
    const mockPaths = [
      {
        id: '1',
        name: 'Frontend Web Developer',
        description: 'Complete path to become a professional frontend developer',
        courses: [
          { id: '1', title: 'HTML & CSS Fundamentals', duration: '3 weeks', level: 'Beginner', order: 0 },
          { id: '2', title: 'JavaScript Essentials', duration: '4 weeks', level: 'Beginner', order: 1 },
          { id: '3', title: 'React Fundamentals', duration: '5 weeks', level: 'Intermediate', order: 2 },
          { id: '4', title: 'Advanced React Patterns', duration: '6 weeks', level: 'Advanced', order: 3 }
        ],
        duration: '18 weeks',
        level: 'Beginner to Advanced',
        enrolledStudents: 456,
        completionRate: 78,
        status: 'active',
        totalCourses: 4
      },
      {
        id: '2',
        name: 'Full Stack JavaScript Developer',
        description: 'Comprehensive full stack development with JavaScript ecosystem',
        courses: [
          { id: '1', title: 'HTML & CSS Fundamentals', duration: '3 weeks', level: 'Beginner', order: 0 },
          { id: '2', title: 'JavaScript Essentials', duration: '4 weeks', level: 'Beginner', order: 1 },
          { id: '3', title: 'React Fundamentals', duration: '5 weeks', level: 'Intermediate', order: 2 },
          { id: '6', title: 'Node.js Fundamentals', duration: '4 weeks', level: 'Intermediate', order: 3 },
          { id: '7', title: 'Express.js & APIs', duration: '4 weeks', level: 'Intermediate', order: 4 },
          { id: '8', title: 'Database Design & MongoDB', duration: '3 weeks', level: 'Intermediate', order: 5 },
          { id: '10', title: 'Full Stack JavaScript', duration: '8 weeks', level: 'Advanced', order: 6 }
        ],
        duration: '31 weeks',
        level: 'Beginner to Advanced',
        enrolledStudents: 234,
        completionRate: 72,
        status: 'active',
        totalCourses: 7
      },
      {
        id: '3',
        name: 'Backend API Developer',
        description: 'Specialize in backend development and API design',
        courses: [
          { id: '2', title: 'JavaScript Essentials', duration: '4 weeks', level: 'Beginner', order: 0 },
          { id: '6', title: 'Node.js Fundamentals', duration: '4 weeks', level: 'Intermediate', order: 1 },
          { id: '7', title: 'Express.js & APIs', duration: '4 weeks', level: 'Intermediate', order: 2 },
          { id: '8', title: 'Database Design & MongoDB', duration: '3 weeks', level: 'Intermediate', order: 3 },
          { id: '12', title: 'Docker & Containerization', duration: '3 weeks', level: 'Intermediate', order: 4 },
          { id: '13', title: 'AWS Cloud Fundamentals', duration: '5 weeks', level: 'Intermediate', order: 5 }
        ],
        duration: '23 weeks',
        level: 'Intermediate to Advanced',
        enrolledStudents: 189,
        completionRate: 85,
        status: 'active',
        totalCourses: 6
      },
      {
        id: '4',
        name: 'Mobile App Developer',
        description: 'Learn to build mobile applications for iOS and Android',
        courses: [
          { id: '2', title: 'JavaScript Essentials', duration: '4 weeks', level: 'Beginner', order: 0 },
          { id: '3', title: 'React Fundamentals', duration: '5 weeks', level: 'Intermediate', order: 1 },
          { id: '4', title: 'Advanced React Patterns', duration: '6 weeks', level: 'Advanced', order: 2 },
          { id: '15', title: 'React Native Mobile Apps', duration: '6 weeks', level: 'Advanced', order: 3 }
        ],
        duration: '21 weeks',
        level: 'Intermediate to Advanced',
        enrolledStudents: 156,
        completionRate: 68,
        status: 'active',
        totalCourses: 4
      },
      {
        id: '5',
        name: 'DevOps Engineer',
        description: 'Master deployment, automation, and cloud infrastructure',
        courses: [
          { id: '6', title: 'Node.js Fundamentals', duration: '4 weeks', level: 'Intermediate', order: 0 },
          { id: '12', title: 'Docker & Containerization', duration: '3 weeks', level: 'Intermediate', order: 1 },
          { id: '13', title: 'AWS Cloud Fundamentals', duration: '5 weeks', level: 'Intermediate', order: 2 },
          { id: '14', title: 'CI/CD with GitHub Actions', duration: '2 weeks', level: 'Advanced', order: 3 }
        ],
        duration: '14 weeks',
        level: 'Intermediate to Advanced',
        enrolledStudents: 123,
        completionRate: 82,
        status: 'active',
        totalCourses: 4
      },
      {
        id: '6',
        name: 'Data Science Specialist',
        description: 'Complete data science and machine learning path',
        courses: [
          { id: '17', title: 'Python for Data Science', duration: '5 weeks', level: 'Intermediate', order: 0 },
          { id: '18', title: 'Machine Learning Fundamentals', duration: '6 weeks', level: 'Advanced', order: 1 }
        ],
        duration: '11 weeks',
        level: 'Intermediate to Advanced',
        enrolledStudents: 98,
        completionRate: 75,
        status: 'active',
        totalCourses: 2
      }
    ];

    // Generate diverse student data
    const mockStudents = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face',
        enrolledCourses: ['1', '2', '3'],
        completedCourses: ['1', '2'],
        joinDate: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        enrolledCourses: ['1', '6', '7'],
        completedCourses: ['1'],
        joinDate: '2024-02-01',
        status: 'active'
      },
      {
        id: '3',
        name: 'Carol Martinez',
        email: 'carol.martinez@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        enrolledCourses: ['17', '18'],
        completedCourses: [],
        joinDate: '2024-01-20',
        status: 'active'
      },
      {
        id: '4',
        name: 'David Chen',
        email: 'david.chen@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        enrolledCourses: ['10', '11'],
        completedCourses: ['1', '2', '3', '6', '7'],
        joinDate: '2023-11-10',
        status: 'active'
      },
      {
        id: '5',
        name: 'Emma Thompson',
        email: 'emma.thompson@example.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        enrolledCourses: ['15', '16'],
        completedCourses: ['2', '3', '4'],
        joinDate: '2024-01-05',
        status: 'active'
      }
    ];

    // Generate instructor data
    const mockTutors = [
      {
        id: '1',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@eduplatform.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face',
        specialization: 'Frontend Development',
        experience: '8 years',
        rating: 4.8,
        courses: ['1'],
        status: 'active'
      },
      {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike.johnson@eduplatform.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        specialization: 'JavaScript Development',
        experience: '6 years',
        rating: 4.9,
        courses: ['2'],
        status: 'active'
      },
      {
        id: '3',
        name: 'Emily Chen',
        email: 'emily.chen@eduplatform.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        specialization: 'React Development',
        experience: '5 years',
        rating: 4.7,
        courses: ['3'],
        status: 'active'
      },
      {
        id: '4',
        name: 'Dr. Rachel Green',
        email: 'rachel.green@eduplatform.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        specialization: 'Data Science',
        experience: '12 years',
        rating: 4.9,
        courses: ['17'],
        status: 'active'
      }
    ];

    setCourses(mockCourses);
    setPaths(mockPaths);
    setStudents(mockStudents);
    setTutors(mockTutors);
  };

  // CRUD operations
  const addCourse = (course) => {
    const newCourse = { ...course, id: uuidv4() };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (id, updates) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  };

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const addStudent = (student) => {
    const newStudent = { ...student, id: uuidv4() };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addTutor = (tutor) => {
    const newTutor = { ...tutor, id: uuidv4() };
    setTutors(prev => [...prev, newTutor]);
    return newTutor;
  };

  const updateTutor = (id, updates) => {
    setTutors(prev => prev.map(tutor => 
      tutor.id === id ? { ...tutor, ...updates } : tutor
    ));
  };

  const deleteTutor = (id) => {
    setTutors(prev => prev.filter(tutor => tutor.id !== id));
  };

  const value = {
    courses,
    students,
    tutors,
    campaigns,
    paths,
    exams,
    certificates,
    addCourse,
    updateCourse,
    deleteCourse,
    addStudent,
    updateStudent,
    deleteStudent,
    addTutor,
    updateTutor,
    deleteTutor
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};