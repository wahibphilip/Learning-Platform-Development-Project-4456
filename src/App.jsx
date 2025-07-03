import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Courses from './pages/Courses/Courses';
import CourseDetail from './pages/Courses/CourseDetail';
import Students from './pages/Students/Students';
import Tutors from './pages/Tutors/Tutors';
import Campaigns from './pages/Campaigns/Campaigns';
import Paths from './pages/Paths/Paths';
import Exams from './pages/Exams/Exams';
import Certificates from './pages/Certificates/Certificates';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseDetail />} />
                <Route path="students" element={<Students />} />
                <Route path="tutors" element={<Tutors />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="paths" element={<Paths />} />
                <Route path="exams" element={<Exams />} />
                <Route path="certificates" element={<Certificates />} />
              </Route>
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;