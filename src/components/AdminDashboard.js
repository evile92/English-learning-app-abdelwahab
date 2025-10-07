import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
// ✅ 1. تم تعديل هذا السطر لإضافة أيقونة البريد Mail
import { Shield, Users, BarChart2, Edit3, MessageSquare, Send, ArrowLeft, Wrench, AlertTriangle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// استيراد جميع مكونات لوحة التحكم
import Analytics from './admin/Analytics';
import UserManagement from './admin/UserManagement';
import ContentManagement from './admin/ContentManagement';
import FeedbackList from './admin/FeedbackList';
import Announcements from './admin/Announcements';
import AppSettings from './admin/AppSettings';
import ErrorReports from './admin/ErrorReports';
// 2. تم إضافة هذا السطر لاستيراد المكون الجديد
import MassEmailSender from './admin/MassEmailSender';

const AdminDashboard = () => {
    const { userData } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analytics');

    if (!userData?.isAdmin) {
        return (
            <div className="text-center p-8 animate-fade-in">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }
    
    const renderContent = () => {
        switch (activeTab) {
            case 'analytics': return <Analytics />;
            case 'users': return <UserManagement />;
            case 'content': return <ContentManagement />;
            case 'feedback': return <FeedbackList />;
            case 'announcements': return <Announcements />;
            case 'settings': return <AppSettings />;
            case 'error-reports': return <ErrorReports />;
            case 'mass-email': return <MassEmailSender />;   
            default: return <Analytics />;
        }
    };

    const NavItem = ({ tabName, icon, children }) => (
        <button 
            onClick={() => setActiveTab(tabName)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${
                activeTab === tabName 
                ? 'bg-sky-500 text-white' 
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
        >
            {icon} {children}
        </button>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold">
                <ArrowLeft size={20} /> Back to App
            </button>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <h1 className="text-xl font-bold mb-4 flex items-center gap-3 px-2">
                        <Shield /> Admin Panel
                    </h1>
                    <nav className="space-y-2">
                        <NavItem tabName="analytics" icon={<BarChart2 size={18}/>}>Analytics</NavItem>
                        <NavItem tabName="users" icon={<Users size={18}/>}>Users</NavItem>
                        <NavItem tabName="content" icon={<Edit3 size={18}/>}>Content</NavItem>
                        <NavItem tabName="feedback" icon={<MessageSquare size={18}/>}>Feedback</NavItem>
                        <NavItem tabName="announcements" icon={<Send size={18}/>}>Send Message</NavItem>
                        {/* ✅ 3. تم إضافة هذا السطر لإظهار الزر في القائمة */}
                        <NavItem tabName="mass-email" icon={<Mail size={18}/>}>Mass Email</NavItem>
                        <NavItem tabName="settings" icon={<Wrench size={18}/>}>App Settings</NavItem>
                        <NavItem tabName="error-reports" icon={<AlertTriangle size={18}/>}>Error Reports</NavItem>
                    </nav>
                </aside>

                <main className="flex-grow w-full">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
