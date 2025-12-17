import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from './Layout'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Pages (using relative paths for Vercel compatibility)
import Home from './pages/Home'
import FindWork from './pages/FindWork'
import PostWork from './pages/PostWork'
import EmployerHome from './pages/EmployerHome'
import WorkerHome from './pages/WorkerHome'
import EmployerDashboard from './pages/EmployerDashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import EditJob from './pages/EditJob'
import EditEmployerProfile from './pages/EditEmployerProfile'
import EditWorkerProfile from './pages/EditWorkerProfile'
import EmployerRegistration from './pages/EmployerRegistration'
import WorkerRegistration from './pages/WorkerRegistration'
import RoleSelection from './pages/RoleSelection'
import Safety from './pages/Safety'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'

const queryClient = new QueryClient()

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
            <Route path="/Home" element={<Layout currentPageName="Home"><Home /></Layout>} />
            <Route path="/FindWork" element={<Layout currentPageName="FindWork"><FindWork /></Layout>} />
            <Route path="/PostWork" element={<Layout currentPageName="PostWork"><PostWork /></Layout>} />
            <Route path="/EmployerHome" element={<Layout currentPageName="EmployerHome"><EmployerHome /></Layout>} />
            <Route path="/WorkerHome" element={<Layout currentPageName="WorkerHome"><WorkerHome /></Layout>} />
            <Route path="/EmployerDashboard" element={<Layout currentPageName="EmployerDashboard"><EmployerDashboard /></Layout>} />
            <Route path="/WorkerDashboard" element={<Layout currentPageName="WorkerDashboard"><WorkerDashboard /></Layout>} />
            <Route path="/EditJob" element={<Layout currentPageName="EditJob"><EditJob /></Layout>} />
            <Route path="/EditEmployerProfile" element={<Layout currentPageName="EditEmployerProfile"><EditEmployerProfile /></Layout>} />
            <Route path="/EditWorkerProfile" element={<Layout currentPageName="EditWorkerProfile"><EditWorkerProfile /></Layout>} />
            <Route path="/EmployerRegistration" element={<Layout currentPageName="EmployerRegistration"><EmployerRegistration /></Layout>} />
            <Route path="/WorkerRegistration" element={<Layout currentPageName="WorkerRegistration"><WorkerRegistration /></Layout>} />
            <Route path="/RoleSelection" element={<Layout currentPageName="RoleSelection"><RoleSelection /></Layout>} />
            <Route path="/Safety" element={<Layout currentPageName="Safety"><Safety /></Layout>} />
            <Route path="/AboutUs" element={<Layout currentPageName="AboutUs"><AboutUs /></Layout>} />
            <Route path="/ContactUs" element={<Layout currentPageName="ContactUs"><ContactUs /></Layout>} />
            {/* Fallback */}
            <Route path="*" element={<Layout currentPageName="Home"><Home /></Layout>} />
        </Routes>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
)
