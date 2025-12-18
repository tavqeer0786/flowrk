import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from './Layout'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Pages (FIXED: Pages capital P)
import Home from './Pages/Home'
import FindWork from './Pages/FindWork'
import PostWork from './Pages/PostWork'
import EmployerHome from './Pages/EmployerHome'
import WorkerHome from './Pages/WorkerHome'
import EmployerDashboard from './Pages/EmployerDashboard'
import WorkerDashboard from './Pages/WorkerDashboard'
import EditJob from './Pages/EditJob'
import EditEmployerProfile from './Pages/EditEmployerProfile'
import EditWorkerProfile from './Pages/EditWorkerProfile'
import EmployerRegistration from './Pages/EmployerRegistration'
import WorkerRegistration from './Pages/WorkerRegistration'
import RoleSelection from './Pages/RoleSelection'
import Safety from './Pages/Safety'
import AboutUs from './Pages/AboutUs'
import ContactUs from './Pages/ContactUs'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import TermsConditions from './Pages/TermsConditions'

// Admin Pages
import AdminLogin from './Pages/AdminLogin'
import AdminOverview from './Pages/AdminOverview'
import AdminJobModeration from './Pages/AdminJobModeration'
import AdminCMS from './Pages/AdminCMS'
import AdminUserManagement from './Pages/AdminUserManagement'
import AdminSettings from './Pages/AdminSettings'
import AdminLogs from './Pages/AdminLogs'
import AdminNotifications from './Pages/AdminNotifications'

// Custom Layouts
import AdminLayout from './components/Admin/AdminLayout'

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
            <Route path="/PrivacyPolicy" element={<Layout currentPageName="PrivacyPolicy"><PrivacyPolicy /></Layout>} />
            <Route path="/TermsConditions" element={<Layout currentPageName="TermsConditions"><TermsConditions /></Layout>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminOverview /></AdminLayout>} />
            <Route path="/admin/jobs" element={<AdminLayout><AdminJobModeration /></AdminLayout>} />
            <Route path="/admin/cms" element={<AdminLayout><AdminCMS /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><AdminUserManagement /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
            <Route path="/admin/logs" element={<AdminLayout><AdminLogs /></AdminLayout>} />
            <Route path="/admin/notifications" element={<AdminLayout><AdminNotifications /></AdminLayout>} />
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
    </React.StrictMode>
)
