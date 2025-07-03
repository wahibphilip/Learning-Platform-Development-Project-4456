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
    // Initialize with mock data
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Mock Courses
    const mockCourses = [
      {
        id: '1',
        title: 'React Fundamentals',
        description: 'Learn the basics of React development',
        instructor: 'John Doe',
        duration: '4 weeks',
        level: 'Beginner',
        price: 299,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
        enrolled: 245,
        rating: 4.8,
        status: 'active'
      },
      {
        id: '2',
        title: 'Advanced JavaScript',
        description: 'Master advanced JavaScript concepts',
        instructor: 'Jane Smith',
        duration: '6 weeks',
        level: 'Advanced',
        price: 399,
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
        enrolled: 189,
        rating: 4.9,
        status: 'active'
      }
    ];

    // Mock Students
    const mockStudents = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face',
        enrolledCourses: ['1', '2'],
        completedCourses: ['1'],
        joinDate: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        enrolledCourses: ['1'],
        completedCourses: [],
        joinDate: '2024-02-01',
        status: 'active'
      }
    ];

    // Mock Tutors
    const mockTutors = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        specialization: 'React Development',
        experience: '5 years',
        rating: 4.8,
        courses: ['1'],
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        specialization: 'JavaScript',
        experience: '7 years',
        rating: 4.9,
        courses: ['2'],
        status: 'active'
      }
    ];

    setCourses(mockCourses);
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