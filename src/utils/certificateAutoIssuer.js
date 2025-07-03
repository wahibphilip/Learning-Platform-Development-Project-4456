import { generateCertificateId, generateCertificateHash } from './certificateAuth';

// Certificate types
export const CERTIFICATE_TYPES = {
  ATTENDANCE: 'attendance',
  EXAM: 'exam',
  LEARNING_PATH: 'learning_path',
  COURSE_COMPLETION: 'course_completion'
};

// Get certificate settings from localStorage
const getCertificateSettings = () => {
  const defaultSettings = {
    autoIssueAttendance: true,
    autoIssueExam: true,
    autoIssuePath: true,
    attendanceThreshold: 80,
    examPassingScore: 70,
    pathCompletionRequired: 100
  };
  
  const saved = localStorage.getItem('settings_certificates');
  return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
};

// Auto-issue attendance certificate
export const checkAndIssueAttendanceCertificate = (studentId, courseId, attendancePercentage) => {
  const settings = getCertificateSettings();
  
  if (!settings.autoIssueAttendance || attendancePercentage < settings.attendanceThreshold) {
    return null;
  }

  const certificate = {
    id: Date.now().toString(),
    studentId,
    courseId,
    type: CERTIFICATE_TYPES.ATTENDANCE,
    certificateId: generateCertificateId(),
    studentName: getStudentName(studentId),
    studentEmail: getStudentEmail(studentId),
    courseName: getCourseName(courseId),
    instructorName: getCourseInstructor(courseId),
    completionDate: new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'Completed',
    score: attendancePercentage,
    status: 'issued',
    isVerified: true,
    attendancePercentage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Generate integrity hash
  certificate.hash = generateCertificateHash(certificate);
  
  // Save certificate
  saveCertificate(certificate);
  
  return certificate;
};

// Auto-issue exam certificate
export const checkAndIssueExamCertificate = (studentId, examId, score, grade) => {
  const settings = getCertificateSettings();
  
  if (!settings.autoIssueExam || score < settings.examPassingScore) {
    return null;
  }

  const certificate = {
    id: Date.now().toString(),
    studentId,
    examId,
    type: CERTIFICATE_TYPES.EXAM,
    certificateId: generateCertificateId(),
    studentName: getStudentName(studentId),
    studentEmail: getStudentEmail(studentId),
    courseName: getExamCourseName(examId),
    instructorName: getExamInstructor(examId),
    examTitle: getExamTitle(examId),
    completionDate: new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    grade,
    score,
    status: 'issued',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  certificate.hash = generateCertificateHash(certificate);
  saveCertificate(certificate);
  
  return certificate;
};

// Auto-issue learning path certificate
export const checkAndIssuePathCertificate = (studentId, pathId, completionPercentage) => {
  const settings = getCertificateSettings();
  
  if (!settings.autoIssuePath || completionPercentage < settings.pathCompletionRequired) {
    return null;
  }

  const certificate = {
    id: Date.now().toString(),
    studentId,
    pathId,
    type: CERTIFICATE_TYPES.LEARNING_PATH,
    certificateId: generateCertificateId(),
    studentName: getStudentName(studentId),
    studentEmail: getStudentEmail(studentId),
    pathName: getPathName(pathId),
    courseName: getPathName(pathId), // Use path name as course name for consistency
    instructorName: 'EduPlatform',
    completionDate: new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'Completed',
    score: completionPercentage,
    status: 'issued',
    isVerified: true,
    pathCompletionPercentage: completionPercentage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  certificate.hash = generateCertificateHash(certificate);
  saveCertificate(certificate);
  
  return certificate;
};

// Auto-issue course completion certificate
export const checkAndIssueCourseCompletionCertificate = (studentId, courseId, finalGrade, finalScore) => {
  const certificate = {
    id: Date.now().toString(),
    studentId,
    courseId,
    type: CERTIFICATE_TYPES.COURSE_COMPLETION,
    certificateId: generateCertificateId(),
    studentName: getStudentName(studentId),
    studentEmail: getStudentEmail(studentId),
    courseName: getCourseName(courseId),
    instructorName: getCourseInstructor(courseId),
    completionDate: new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    grade: finalGrade,
    score: finalScore,
    status: 'issued',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  certificate.hash = generateCertificateHash(certificate);
  saveCertificate(certificate);
  
  return certificate;
};

// Save certificate to storage
const saveCertificate = (certificate) => {
  const existingCertificates = JSON.parse(localStorage.getItem('autoCertificates') || '[]');
  existingCertificates.push(certificate);
  localStorage.setItem('autoCertificates', JSON.stringify(existingCertificates));
  
  // Also trigger notification
  dispatchCertificateEvent(certificate);
};

// Dispatch custom event for certificate issuance
const dispatchCertificateEvent = (certificate) => {
  const event = new CustomEvent('certificateIssued', {
    detail: certificate
  });
  window.dispatchEvent(event);
};

// Helper functions to get data (these would normally query your backend)
const getStudentName = (studentId) => {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const student = students.find(s => s.id === studentId);
  return student?.name || 'Unknown Student';
};

const getStudentEmail = (studentId) => {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const student = students.find(s => s.id === studentId);
  return student?.email || 'unknown@example.com';
};

const getCourseName = (courseId) => {
  const courses = JSON.parse(localStorage.getItem('courses') || '[]');
  const course = courses.find(c => c.id === courseId);
  return course?.title || 'Unknown Course';
};

const getCourseInstructor = (courseId) => {
  const courses = JSON.parse(localStorage.getItem('courses') || '[]');
  const course = courses.find(c => c.id === courseId);
  return course?.instructor || 'Unknown Instructor';
};

const getExamTitle = (examId) => {
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  const exam = exams.find(e => e.id === examId);
  return exam?.title || 'Unknown Exam';
};

const getExamCourseName = (examId) => {
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  const exam = exams.find(e => e.id === examId);
  return exam?.course || 'Unknown Course';
};

const getExamInstructor = (examId) => {
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  const exam = exams.find(e => e.id === examId);
  return exam?.instructor || 'Unknown Instructor';
};

const getPathName = (pathId) => {
  const paths = JSON.parse(localStorage.getItem('learningPaths') || '[]');
  const path = paths.find(p => p.id === pathId);
  return path?.name || 'Unknown Learning Path';
};

// Get all auto-issued certificates
export const getAutoIssuedCertificates = () => {
  return JSON.parse(localStorage.getItem('autoCertificates') || '[]');
};

// Check if student already has certificate of specific type for specific item
export const hasExistingCertificate = (studentId, type, itemId) => {
  const certificates = getAutoIssuedCertificates();
  return certificates.some(cert => 
    cert.studentId === studentId && 
    cert.type === type && 
    (cert.courseId === itemId || cert.examId === itemId || cert.pathId === itemId)
  );
};