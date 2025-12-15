import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import { Navigate, Route, Routes } from "react-router"
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProblemsPage from './pages/ProblemsPage';
import { Toaster } from 'react-hot-toast';
import DashBoardPage from './pages/DashBoardPage';
import ProblemDetailPage from './pages/ProblemDetailPage';

function App() {

  const { isSignedIn, isLoaded } = useAuth();

  if(!isLoaded) return null;

  return (
    <>
    <Routes>
      {/* <h1 className='text-red-500 bg-orange-400 p-10 text-3xl'>Welcome to Coding Platform</h1> */}

      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={isSignedIn ? <DashBoardPage /> : <Navigate to={"/"} />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
      <Route path="/problems/:id" element={isSignedIn ? <ProblemDetailPage /> : <Navigate to={"/"} />} />
    </Routes>
    <Toaster toastOptions={{duration:3000}} />
    </>
  )
}

export default App
