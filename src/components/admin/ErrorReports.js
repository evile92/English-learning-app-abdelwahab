import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Clock, User, Globe, CheckCircle, Loader, Bug, XCircle, Info } from 'lucide-react';

const ErrorStatCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{value}</p>
            </div>
        </div>
    </div>
);

const getSeverityColor = (severity) => ({
    critical: 'text-red-600 bg-red-100 border-red-200',
    high: 'text-orange-600 bg-orange-100 border-orange-200',
    medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
    low: 'text-blue-600 bg-blue-100 border-blue-200'
}[severity] || 'text-gray-600 bg-gray-100 border-gray-200');

const formatTime = (timestamp) => {
    if (!timestamp) return 'غير معروف';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const hours = Math.round((new Date() - date) / (1000 * 60 * 60));
    if (hours < 1) return 'الآن';
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.round(hours / 24)} يوم`;
};

const getBrowserName = (userAgent) => {
    if (!userAgent) return 'غير معروف';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'غير معروف';
};

const ErrorReports = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchErrors = async () => {
            try {
                const errorsSnapshot = await getDocs(collection(db, "error_reports"));
                const errorsList = errorsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    reportedAt: doc.data().reportedAt || new Date()
                }));
                
                setErrors(errorsList.sort((a, b) => {
                    const dateA = a.reportedAt.toDate ? a.reportedAt.toDate() : new Date(a.reportedAt);
                    const dateB = b.reportedAt.toDate ? b.reportedAt.toDate() : new Date(b.reportedAt);
                    return dateB - dateA;
                }));
            } catch (error) {
                console.error("Error fetching error reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchErrors();
    }, []);

    const processedData = useMemo(() => {
        const stats = {
            total: errors.length,
            critical: errors.filter(e => e.severity === 'critical').length,
            high: errors.filter(e => e.severity === 'high').length,
            medium: errors.filter(e => e.severity === 'medium').length,
            low: errors.filter(e => e.severity === 'low').length,
            resolved: errors.filter(e => e.resolved).length,
            today: errors.filter(e => {
                const date = e.reportedAt.toDate ? e.reportedAt.toDate() : new Date(e.reportedAt);
                return date >= new Date(new Date().setHours(0, 0, 0, 0));
            }).length
        };

        const severityChart = [
            { name: 'حرجة', value: stats.critical, color: '#ef4444' },
            { name: 'مهمة', value: stats.high, color: '#f97316' },
            { name: 'متوسطة', value: stats.medium, color: '#eab308' },
            { name: 'منخفضة', value: stats.low, color: '#3b82f6' }
        ].filter(item => item.value > 0);

        const contextChart = Object.entries(
            errors.reduce((acc, error) => {
                const context = error.context || 'غير محدد';
                acc[context] = (acc[context] || 0) + 1;
                return acc;
            }, {})
        ).map(([context, count]) => ({ name: context, errors: count }))
         .sort((a, b) => b.errors - a.errors)
         .slice(0, 6);

        const filteredErrors = errors.filter(error => {
            if (filter === 'all') return true;
            if (filter === 'resolved') return error.resolved;
            if (filter === 'unresolved') return !error.resolved;
            return error.severity === filter;
        });

        return { stats, severityChart, contextChart, filteredErrors };
    }, [errors, filter]);

    const markAsResolved = async (errorId) => {
        try {
            await updateDoc(doc(db, 'error_reports', errorId), {
                resolved: true,
                resolvedAt: new Date()
            });
            setErrors(prev => prev.map(error => 
                error.id === errorId ? { ...error, resolved: true } : error
            ));
            alert('✅ تم وضع علامة على الخطأ كمحلول');
        } catch (error) {
            alert('❌ فشل في تحديث حالة الخطأ');
        }
    };

    const viewErrorDetails = (error) => {
        const details = `
🚨 تفاصيل الخطأ

📍 السياق: ${error.context}
📝 الرسالة: ${error.message}
👤 المستخدم: ${error.userName || error.userId}
🌐 المتصفح: ${getBrowserName(error.userAgent)}
⏰ الوقت: ${formatTime(error.reportedAt)}
        `;
        alert(details);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-12">
                <Loader className="animate-spin text-sky-500" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <AlertTriangle className="text-red-500" />
                    تقارير الأخطاء
                </h2>
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
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

            {/* الإحصائيات */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <ErrorStatCard title="المجموع" value={processedData.stats.total} icon={<Bug className="text-white" size={16} />} color="bg-slate-600" />
                <ErrorStatCard title="حرجة" value={processedData.stats.critical} icon={<XCircle className="text-white" size={16} />} color="bg-red-500" />
                <ErrorStatCard title="مهمة" value={processedData.stats.high} icon={<AlertTriangle className="text-white" size={16} />} color="bg-orange-500" />
                <ErrorStatCard title="متوسطة" value={processedData.stats.medium} icon={<Clock className="text-white" size={16} />} color="bg-yellow-500" />
                <ErrorStatCard title="منخفضة" value={processedData.stats.low} icon={<Info className="text-white" size={16} />} color="bg-blue-500" />
                <ErrorStatCard title="محلولة" value={processedData.stats.resolved} icon={<CheckCircle className="text-white" size={16} />} color="bg-green-500" />
                <ErrorStatCard title="اليوم" value={processedData.stats.today} icon={<Clock className="text-white" size={16} />} color="bg-purple-500" />
            </div>

            {/* المخططات */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">توزيع حسب الشدة</h3>
                    {processedData.severityChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={processedData.severityChart} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                    {processedData.severityChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-gray-500">لا توجد أخطاء</div>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">الأخطاء حسب المنطقة</h3>
                    {processedData.contextChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={processedData.contextChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="errors" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-gray-500">لا توجد بيانات</div>
                    )}
                </div>
            </div>

            {/* قائمة الأخطاء */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
                    الأخطاء الحديثة ({processedData.filteredErrors.length})
                </h3>
                
                {processedData.filteredErrors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <p>لا توجد أخطاء! 🎉</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {processedData.filteredErrors.slice(0, 10).map(error => (
                            <div key={error.id} className={`p-4 rounded-lg border ${error.resolved ? 'opacity-60' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(error.severity)}`}>
                                            {error.severity}
                                        </span>
                                        <span className="font-medium">{error.context}</span>
                                        {error.resolved && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    </div>
                                    <span className="text-sm text-gray-500">{formatTime(error.reportedAt)}</span>
                                </div>
                                <p className="text-red-600 mb-2">{error.message}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>👤 {error.userName || error.userId}</span>
                                        <span>🌐 {getBrowserName(error.userAgent)}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {!error.resolved && (
                                            <button onClick={() => markAsResolved(error.id)} className="px-3 py-1 bg-green-600 text-white text-sm rounded">
                                                ✅ تم الحل
                                            </button>
                                        )}
                                        <button onClick={() => viewErrorDetails(error)} className="px-3 py-1 bg-gray-600 text-white text-sm rounded">
                                            🔍 التفاصيل
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorReports;

نهاية التعديل
