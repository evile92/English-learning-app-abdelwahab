import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Clock, User, Globe, CheckCircle, Loader, Bug, XCircle } from 'lucide-react';

// --- مكون لعرض إحصائيات الأخطاء ---
const ErrorStatCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </div>
);

// --- ألوان حسب شدة الخطأ ---
const getSeverityColor = (severity) => {
    const colors = {
        critical: 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-700',
        high: 'text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/30 dark:border-orange-700',
        medium: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-700',
        low: 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-700'
    };
    return colors[severity] || colors.medium;
};

// --- دالة لتنسيق الوقت ---
const formatTime = (timestamp) => {
    if (!timestamp) return 'غير معروف';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.RelativeTimeFormat('ar', { numeric: 'auto' }).format(
        Math.round((date - new Date()) / (1000 * 60 * 60 * 24)), 'day'
    );
};

// --- دالة لاستخراج اسم المتصفح ---
const getBrowserName = (userAgent) => {
    if (!userAgent) return 'غير معروف';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'غير معروف';
};

const ErrorReports = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, critical, high, medium, low, resolved
    
    // --- جلب تقارير الأخطاء من Firebase ---
    useEffect(() => {
        const fetchErrors = async () => {
            try {
                const errorsSnapshot = await getDocs(collection(db, "error_reports"));
                const errorsList = errorsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    reportedAt: doc.data().reportedAt || new Date()
                }));
                
                // ترتيب حسب التاريخ (الأحدث أولاً)
                const sortedErrors = errorsList.sort((a, b) => {
                    const dateA = a.reportedAt.toDate ? a.reportedAt.toDate() : new Date(a.reportedAt);
                    const dateB = b.reportedAt.toDate ? b.reportedAt.toDate() : new Date(b.reportedAt);
                    return dateB - dateA;
                });
                
                setErrors(sortedErrors);
            } catch (error) {
                console.error("Error fetching error reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchErrors();
    }, []);

    // --- معالجة البيانات للإحصائيات والمخططات ---
    const processedData = useMemo(() => {
        if (errors.length === 0) return { 
            stats: { total: 0, critical: 0, high: 0, medium: 0, low: 0, resolved: 0, today: 0 },
            severityChart: [],
            contextChart: [],
            filteredErrors: []
        };

        // حساب الإحصائيات
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const stats = {
            total: errors.length,
            critical: errors.filter(e => e.severity === 'critical').length,
            high: errors.filter(e => e.severity === 'high').length,
            medium: errors.filter(e => e.severity === 'medium').length,
            low: errors.filter(e => e.severity === 'low').length,
            resolved: errors.filter(e => e.resolved).length,
            today: errors.filter(e => {
                const errorDate = e.reportedAt.toDate ? e.reportedAt.toDate() : new Date(e.reportedAt);
                return errorDate >= today;
            }).length
        };

        // بيانات مخطط الشدة
        const severityChart = [
            { name: 'Critical', value: stats.critical, color: '#ef4444' },
            { name: 'High', value: stats.high, color: '#f97316' },
            { name: 'Medium', value: stats.medium, color: '#eab308' },
            { name: 'Low', value: stats.low, color: '#3b82f6' }
        ].filter(item => item.value > 0);

        // بيانات مخطط السياق (أكثر المناطق خطأً)
        const contextCounts = errors.reduce((acc, error) => {
            const context = error.context || 'Unknown';
            acc[context] = (acc[context] || 0) + 1;
            return acc;
        }, {});

        const contextChart = Object.entries(contextCounts)
            .map(([context, count]) => ({ name: context, errors: count }))
            .sort((a, b) => b.errors - a.errors)
            .slice(0, 8); // أعلى 8 مناطق

        // فلترة الأخطاء
        const filteredErrors = errors.filter(error => {
            if (filter === 'all') return true;
            if (filter === 'resolved') return error.resolved;
            if (filter === 'unresolved') return !error.resolved;
            return error.severity === filter;
        });

        return { stats, severityChart, contextChart, filteredErrors };
    }, [errors, filter]);

    // --- وضع علامة على الخطأ كمحلول ---
    const markAsResolved = async (errorId) => {
        try {
            await updateDoc(doc(db, 'error_reports', errorId), {
                resolved: true,
                resolvedAt: new Date(),
                resolvedBy: 'admin'
            });
            
            // تحديث الحالة المحلية
            setErrors(prev => prev.map(error => 
                error.id === errorId 
                ? { ...error, resolved: true, resolvedAt: new Date() }
                : error
            ));
            
            alert('✅ تم وضع علامة على الخطأ كمحلول');
        } catch (error) {
            console.error('فشل في تحديث حالة الخطأ:', error);
            alert('❌ فشل في تحديث حالة الخطأ');
        }
    };

    // --- عرض تفاصيل الخطأ الكاملة ---
    const viewErrorDetails = (error) => {
        const details = `
🚨 تفاصيل الخطأ الكاملة

📍 السياق: ${error.context}
📝 الرسالة: ${error.message}  
🔧 الكود: ${error.code}
⚠️ الشدة: ${error.severity}

👤 معلومات المستخدم:
- المعرف: ${error.userId}
- الاسم: ${error.userName || 'غير متوفر'}
- المستوى: ${error.userLevel || 'غير معروف'}

🌐 معلومات تقنية:
- الرابط: ${error.url}
- المتصفح: ${getBrowserName(error.userAgent)}
- الوقت: ${error.timestamp}

⏰ وقت التقرير: ${error.reportedAt.toDate ? error.reportedAt.toDate().toLocaleString('ar-EG') : 'غير محدد'}

${error.resolved ? '✅ تم الحل في: ' + (error.resolvedAt?.toLocaleString('ar-EG') || 'غير محدد') : '❌ لم يتم الحل بعد'}
        `;
        
        alert(details);
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader className="animate-spin text-sky-500" size={48} /></div>;
    }

    return (
        <div className="p-6 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <AlertTriangle className="text-red-500" />
                    Error Reports Overview
                </h2>
                
                {/* فلتر الأخطاء */}
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                    <option value="all">جميع الأخطاء</option>
                    <option value="critical">حرجة</option>
                    <option value="high">مهمة</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                    <option value="resolved">محلولة</option>
                    <option value="unresolved">غير محلولة</option>
                </select>
            </div>

            {/* إحصائيات الأخطاء */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                <ErrorStatCard title="Total Errors" value={processedData.stats.total} icon={<Bug className="text-white" />} color="bg-slate-600" />
                <ErrorStatCard title="Critical" value={processedData.stats.critical} icon={<XCircle className="text-white" />} color="bg-red-500" />
                <ErrorStatCard title="High" value={processedData.stats.high} icon={<AlertTriangle className="text-white" />} color="bg-orange-500" />
                <ErrorStatCard title="Medium" value={processedData.stats.medium} icon={<Clock className="text-white" />} color="bg-yellow-500" />
                <ErrorStatCard title="Low" value={processedData.stats.low} icon={<Globe className="text-white" />} color="bg-blue-500" />
                <ErrorStatCard title="Resolved" value={processedData.stats.resolved} icon={<CheckCircle className="text-white" />} color="bg-green-500" />
                <ErrorStatCard title="Today" value={processedData.stats.today} icon={<Clock className="text-white" />} color="bg-purple-500" />
            </div>

            {/* المخططات البيانية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* مخطط توزيع الشدة */}
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Error Distribution by Severity</h3>
                    {processedData.severityChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={processedData.severityChart}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {processedData.severityChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                            <p>لا توجد أخطاء لعرضها 🎉</p>
                        </div>
                    )}
                </div>

                {/* مخطط الأخطاء حسب المنطقة */}
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Errors by Context</h3>
                    {processedData.contextChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={processedData.contextChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="errors" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                            <p>لا توجد بيانات لعرضها 📊</p>
                        </div>
                    )}
                </div>
            </div>

            {/* قائمة الأخطاء التفصيلية */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
                    Recent Error Reports ({processedData.filteredErrors.length})
                </h3>
                
                {processedData.filteredErrors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <p className="text-lg font-medium">ممتاز! لا توجد أخطاء {filter === 'all' ? '' : `في فئة "${filter}"`}</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {processedData.filteredErrors.slice(0, 10).map(error => (
                            <div key={error.id} className={`p-4 rounded-lg border ${error.resolved ? 'opacity-60' : ''} hover:shadow-md transition-all`}>
                                {/* رأس الخطأ */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(error.severity)}`}>
                                            {error.severity}
                                        </span>
                                        <span className="font-medium text-slate-800 dark:text-white">{error.context}</span>
                                        {error.resolved && (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                    <span className="text-sm text-slate-500">{formatTime(error.reportedAt)}</span>
                                </div>
                                
                                {/* تفاصيل الخطأ */}
                                <div className="mb-3">
                                    <p className="text-red-600 dark:text-red-400 font-medium mb-1">{error.message}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <span>👤 {error.userName || error.userId}</span>
                                        <span>🌐 {getBrowserName(error.userAgent)}</span>
                                        <span>🔧 {error.code}</span>
                                    </div>
                                </div>
                                
                                {/* أزرار الإجراءات */}
                                <div className="flex gap-2">
                                    {!error.resolved && (
                                        <button
                                            onClick={() => markAsResolved(error.id)}
                                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                                        >
                                            ✅ تم الحل
                                        </button>
                                    )}
                                    <button
                                        onClick={() => viewErrorDetails(error)}
                                        className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
                                    >
                                        🔍 التفاصيل
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {processedData.filteredErrors.length > 10 && (
                            <div className="text-center text-slate-500 text-sm">
                                ... و {processedData.filteredErrors.length - 10} أخطاء أخرى
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorReports;
