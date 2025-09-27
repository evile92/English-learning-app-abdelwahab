import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Clock, User, Globe, CheckCircle, Loader, Bug, XCircle, Info, Code, Smartphone, Monitor } from 'lucide-react';

const ErrorStatCard = ({ title, value, icon, color, description }) => (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{value}</p>
                {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
            </div>
        </div>
    </div>
);

const getSeverityColor = (severity) => ({
    critical: 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30',
    high: 'text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/30',
    medium: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30',
    low: 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30'
}[severity] || 'text-gray-600 bg-gray-100 border-gray-200');

const formatTime = (timestamp) => {
    if (!timestamp) return 'غير معروف';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 5) return 'الآن';
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-EG');
};

const getBrowserName = (userAgent) => {
    if (!userAgent) return { name: 'غير معروف', icon: Globe };
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
        if (userAgent.includes('Chrome')) return { name: 'Chrome موبايل', icon: Smartphone };
        if (userAgent.includes('Safari')) return { name: 'Safari موبايل', icon: Smartphone };
        if (userAgent.includes('Firefox')) return { name: 'Firefox موبايل', icon: Smartphone };
        return { name: 'متصفح الموبايل', icon: Smartphone };
    }
    if (userAgent.includes('Chrome')) return { name: 'Chrome', icon: Monitor };
    if (userAgent.includes('Firefox')) return { name: 'Firefox', icon: Monitor };
    if (userAgent.includes('Safari')) return { name: 'Safari', icon: Monitor };
    if (userAgent.includes('Edge')) return { name: 'Edge', icon: Monitor };
    return { name: 'غير معروف', icon: Globe };
};

// 🆕 ترجمة أنواع الأخطاء
const getErrorTypeDisplay = (code) => {
    const types = {
        'FIREBASE_PERMISSION_DENIED': '🔐 رفض الصلاحية',
        'FIREBASE_NETWORK_ERROR': '🌐 خطأ شبكة',
        'FIREBASE_QUOTA_EXCEEDED': '⚡ تجاوز الحد',
        'API_TIMEOUT': '⏱️ انتهاء الوقت',
        'API_RATE_LIMIT': '🚦 تجاوز المعدل',
        'API_INVALID_RESPONSE': '📡 استجابة غير صالحة',
        'API_SERVER_ERROR': '🔥 خطأ خادم',
        'VALIDATION_ERROR': '✅ خطأ تحقق',
        'RENDER_ERROR': '🎨 خطأ عرض',
        'UNKNOWN_ERROR': '❓ خطأ غير معروف'
    };
    return types[code] || '❓ غير محدد';
};

const ErrorReports = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    // 🆕 refresh state
    const [refreshing, setRefreshing] = useState(false);

    const fetchErrors = async () => {
        setRefreshing(true);
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
            setRefreshing(false);
        }
    };

    useEffect(() => {
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
            }).length,
            // 🆕 إحصائيات إضافية
            unresolved: errors.filter(e => !e.resolved).length,
            reactErrors: errors.filter(e => e.code === 'RENDER_ERROR').length
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
         .slice(0, 8); // 🆕 زيادة العدد إلى 8

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
                resolvedAt: new Date(),
                resolvedBy: 'admin'
            });
            setErrors(prev => prev.map(error => 
                error.id === errorId ? { ...error, resolved: true, resolvedAt: new Date() } : error
            ));
            alert('✅ تم وضع علامة على الخطأ كمحلول');
        } catch (error) {
            console.error('فشل تحديث الخطأ:', error);
            alert('❌ فشل في تحديث حالة الخطأ');
        }
    };

    // 🆕 تحسين عرض التفاصيل
    const viewErrorDetails = (error) => {
        const browserInfo = getBrowserName(error.userAgent);
        const details = `
🚨 تفاصيل الخطأ الكاملة

📍 السياق: ${error.context || 'غير محدد'}
📝 الرسالة: ${error.message}
🔧 نوع الخطأ: ${getErrorTypeDisplay(error.code)}
⚠️ مستوى الشدة: ${error.severity}

👤 معلومات المستخدم:
- المعرف: ${error.userId}
- الاسم: ${error.userName || 'غير متوفر'}
- المستوى: ${error.userLevel || 'غير معروف'}

🌐 معلومات تقنية:
- الصفحة: ${error.url || 'غير محدد'}
- المتصفح: ${browserInfo.name}
- وقت الحدوث: ${error.timestamp || 'غير محدد'}

⏰ تفاصيل التوقيت:
- تم التقرير: ${error.reportedAt?.toDate ? error.reportedAt.toDate().toLocaleString('ar-EG') : 'غير محدد'}
- الحالة: ${error.resolved ? '✅ تم الحل' : '❌ لم يتم الحل'}

${error.stack ? `\n🔍 تتبع المسار:\n${error.stack.substring(0, 300)}...` : ''}
${error.componentStack ? `\n⚛️ مسار المكونات:\n${error.componentStack.substring(0, 200)}...` : ''}
        `;
        alert(details);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="text-center">
                    <Loader className="animate-spin text-sky-500 mx-auto mb-4" size={48} />
                    <p className="text-slate-600 dark:text-slate-400">جاري تحميل تقارير الأخطاء...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* 🆕 رأس محسن */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3 mb-2">
                        <AlertTriangle className="text-red-500" />
                        تقارير الأخطاء
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        آخر تحديث: {new Date().toLocaleString('ar-EG')} 
                        {processedData.stats.total > 0 && ` • ${processedData.stats.unresolved} غير محلولة`}
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="all">جميع الأخطاء ({processedData.stats.total})</option>
                        <option value="critical">حرجة ({processedData.stats.critical})</option>
                        <option value="high">مهمة ({processedData.stats.high})</option>
                        <option value="medium">متوسطة ({processedData.stats.medium})</option>
                        <option value="low">منخفضة ({processedData.stats.low})</option>
                        <option value="resolved">محلولة ({processedData.stats.resolved})</option>
                        <option value="unresolved">غير محلولة ({processedData.stats.unresolved})</option>
                    </select>
                    
                    {/* 🆕 زر التحديث */}
                    <button
                        onClick={fetchErrors}
                        disabled={refreshing}
                        className="px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-slate-400 flex items-center gap-2"
                    >
                        <Loader className={refreshing ? 'animate-spin' : ''} size={16} />
                        تحديث
                    </button>
                </div>
            </div>

            {/* 🆕 الإحصائيات محسنة */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                <ErrorStatCard 
                    title="إجمالي الأخطاء" 
                    value={processedData.stats.total} 
                    icon={<Bug className="text-white" size={16} />} 
                    color="bg-slate-600"
                    description="منذ بداية التشغيل"
                />
                <ErrorStatCard 
                    title="غير محلولة" 
                    value={processedData.stats.unresolved} 
                    icon={<XCircle className="text-white" size={16} />} 
                    color="bg-red-500"
                    description={`${processedData.stats.total > 0 ? Math.round((processedData.stats.unresolved / processedData.stats.total) * 100) : 0}% من المجموع`}
                />
                <ErrorStatCard 
                    title="محلولة" 
                    value={processedData.stats.resolved} 
                    icon={<CheckCircle className="text-white" size={16} />} 
                    color="bg-green-500"
                    description={`${processedData.stats.total > 0 ? Math.round((processedData.stats.resolved / processedData.stats.total) * 100) : 0}% تم حلها`}
                />
                <ErrorStatCard 
                    title="اليوم" 
                    value={processedData.stats.today} 
                    icon={<Clock className="text-white" size={16} />} 
                    color="bg-purple-500"
                    description="خلال آخر 24 ساعة"
                />
            </div>

            {/* 🆕 إحصائيات تفصيلية */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ErrorStatCard 
                    title="حرجة" 
                    value={processedData.stats.critical} 
                    icon={<AlertTriangle className="text-white" size={16} />} 
                    color="bg-red-600"
                    description="تحتاج حل فوري"
                />
                <ErrorStatCard 
                    title="مهمة" 
                    value={processedData.stats.high} 
                    icon={<Info className="text-white" size={16} />} 
                    color="bg-orange-500"
                    description="حل سريع مطلوب"
                />
                <ErrorStatCard 
                    title="متوسطة" 
                    value={processedData.stats.medium} 
                    icon={<Clock className="text-white" size={16} />} 
                    color="bg-yellow-500"
                    description="حل في الوقت المناسب"
                />
                <ErrorStatCard 
                    title="منخفضة" 
                    value={processedData.stats.low} 
                    icon={<Info className="text-white" size={16} />} 
                    color="bg-blue-500"
                    description="حل عند التفرغ"
                />
            </div>

            {/* المخططات */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">توزيع الأخطاء حسب الشدة</h3>
                    {processedData.severityChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={processedData.severityChart} cx="50%" cy="50%" outerRadius={90} fill="#8884d8" dataKey="value" label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}>
                                    {processedData.severityChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                                <p>🎉 لا توجد أخطاء!</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">الأخطاء حسب المصدر</h3>
                    {processedData.contextChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={processedData.contextChart} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="errors" fill="#ef4444" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <Info className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                                <p>📊 لا توجد بيانات</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 🆕 قائمة الأخطاء محسنة */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-md border">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white flex items-center justify-between">
                    <span>أحدث تقارير الأخطاء ({processedData.filteredErrors.length})</span>
                    {processedData.filteredErrors.length > 15 && (
                        <span className="text-sm font-normal text-slate-500">عرض أحدث 15</span>
                    )}
                </h3>
                
                {processedData.filteredErrors.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
                        <h4 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">ممتاز!</h4>
                        <p className="text-lg">لا توجد أخطاء {filter === 'all' ? '' : `في فئة "${filter}"`}</p>
                        <p className="text-sm mt-2">النظام يعمل بشكل مثالي 🚀</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {processedData.filteredErrors.slice(0, 15).map(error => {
                            const browserInfo = getBrowserName(error.userAgent);
                            const BrowserIcon = browserInfo.icon;
                            
                            return (
                                <div key={error.id} className={`p-4 rounded-xl border transition-all hover:shadow-md ${error.resolved ? 'opacity-70 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(error.severity)}`}>
                                                {error.severity === 'critical' ? '🚨 حرج' : 
                                                 error.severity === 'high' ? '⚠️ مهم' :
                                                 error.severity === 'medium' ? '🟡 متوسط' : '🔵 منخفض'}
                                            </span>
                                            <span className="font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                                                {error.context}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {getErrorTypeDisplay(error.code)}
                                            </span>
                                            {error.resolved && (
                                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                                                    <CheckCircle className="w-4 h-4" />
                                                    محلول
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                                            {formatTime(error.reportedAt)}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <p className="text-red-600 dark:text-red-400 font-medium mb-2 leading-relaxed">
                                            {error.message}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <User size={14} />
                                                {error.userName || error.userId}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BrowserIcon size={14} />
                                                {browserInfo.name}
                                            </span>
                                            {error.userLevel && (
                                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                                                    📚 {error.userLevel}
                                                </span>
                                            )}
                                            {error.errorBoundary && (
                                                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
                                                    ⚛️ React
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 justify-between items-center">
                                        <div className="flex gap-2">
                                            {!error.resolved && (
                                                <button
                                                    onClick={() => markAsResolved(error.id)}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                                                >
                                                    <CheckCircle size={14} />
                                                    تم الحل
                                                </button>
                                            )}
                                            <button
                                                onClick={() => viewErrorDetails(error)}
                                                className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                                            >
                                                <Code size={14} />
                                                التفاصيل الكاملة
                                            </button>
                                        </div>
                                        
                                        {error.resolved && error.resolvedAt && (
                                            <span className="text-xs text-green-600 dark:text-green-400">
                                                ✅ حُل منذ {formatTime(error.resolvedAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        
                        {processedData.filteredErrors.length > 15 && (
                            <div className="text-center text-slate-500 text-sm p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                و {processedData.filteredErrors.length - 15} أخطاء أخرى... 
                                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sky-500 hover:underline ml-2">
                                    عودة للأعلى
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorReports;
