import './App.css'
import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from 'react-router';
import { LevelUnitsPage } from './pages/UnitPage';
import { LessonPage } from './pages/LessonPage';
import { LandingPage } from './pages/LandingPage';
import { LevelsPage } from './pages/LevelPage';
import { RegisterForm } from './pages/Register';
import { Login } from './pages/Login';
import Navbar from './pages/NavBar';
import UserPage from './pages/UserPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


export default function App() {
  return (
    <BrowserRouter>
      {/* <nav className="bg-emerald-800 dark:bg-emerald-600 text-white flex flex-row gap-4">
        <Link to="/chao/about" className="font-bold border-r borde-white-1 p-3">Chao</Link>
        <Link to="/chao/levels" className=' border-r borde-white-1 p-3'>Ⓐ All courses</Link>
        <Link to="/chao/about" className=' border-r borde-white-1 p-3'>✉ Chat</Link>
        <Link to="/chao/me" className=' border-r borde-white-1 p-3'>웃 Profile</Link>
      </nav> */}

      <Navbar />

      <Routes>
        {/* Step 1: Landing Page */}
        <Route path="/chao/about" element={<LandingPage />} />

        {/* Step 2: Level Selection */}
        <Route path="/chao/levels" element={<LevelsPage />} />

        {/* Step 3: Units & Lessons List for a chosen Level */}
        <Route path="/chao/:levelId" element={<LevelUnitsPage />} />


        {/* Step 4: Individual Lesson with Completion & Proficiency Rating */}
        <Route path="/chao/:levelId/:lessonId" element={<LessonPage />} />

        {/* Step 5: Register */}
        <Route path="/chao/register" element={<RegisterForm />} />

        {/* Step 6: Login */}
        <Route path="/chao/login" element={<Login />} />
        <Route path="/chao/forgot-password" element={<ForgotPassword />} />
        <Route path="/chao/reset-password" element={<ResetPassword />} />

        {/* Step 7: User profile */}
        <Route path="/chao/me" element={<UserPage />} />


        {/* Wildcard Catch-All: Redirects all unknown URLs back to Home */}
        <Route path="*" element={<Navigate to="/chao/A1" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}

 
