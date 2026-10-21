// Copyright (C) 2026  leahoangtrang. For the full notice: chao-web-app/LICENSE
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
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
import ChatPage from './pages/ChatPage';


export default function App() {
  return (
    <BrowserRouter>
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

        {/* Step 8: Chat */}
        <Route path="/chao/chat" element={<ChatPage />} />

        {/* Wildcard Catch-All: Redirects all unknown URLs back to Home */}
        <Route path="*" element={<Navigate to="/chao/A1" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}

 
