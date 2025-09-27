import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Clock, User, Globe, CheckCircle, Loader, Bug, XCircle, AlertCircle, Info } from 'lucide-react';

// --- بيانات تجريبية للعرض عند عدم وجود أخطاء ---
const DEMO_ERRORS = [
    {
        id: 'demo1',
        message: 'فشل في تسجيل الدخول باستخدام Google',
        severity: 'high',
        context: 'Google Sign-in',
        userId: 'user123',
        userName: 'أحمد محمد',
        userLevel: 'A2',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        url: 'https://stellarspeak.online/login',
        reportedAt: new Date(),
        resolved: false,
        code: 'FIREBASE_PERMISSION_DENIED'
    },
    {
        id: 'demo2', 
        message: 'خطأ في حفظ المفردات الجديدة',
        severity: 'medium',
        context: 'Save Vocabulary',
        userId: 'user456',
        userName: 'سارة أحمد',
        userLevel: 'B1',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        url: 'https://stellarspeak.online/vocabulary',
        reportedAt: new Date(Date.now() - 24*60*60*1000), // أمس
        resolved: true,
        code: 'VALIDATION_ERROR'
    },
    {
        id: 'demo3',
        message: 'انقطاع في الاتصال مع خادم الذكي الاصطناعي',
        severity: 'critical',
        context: 'Gemini API',
        userId: 'user789',
        userName: 'محمد علي',
        userLevel: 'A1',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        url: 'https://stellarspeak.online/lessons',
        reportedAt: new Date(Date.now() - 2*60*60*1000), // قبل ساعتين
        resolved: false,
        code: 'API_TIMEOUT'
    },
    {
        id: 'demo4',
        message: 'خطأ في تحميل محتوى الدرس',
        severity: 'low',
        context: 'Lesson Content',
        userId: 'user101',
        userName: 'فاطمة حسن',
        userLevel: 'B2',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        url: 'https://stellarspeak.online/lessonContent',
        reportedAt: new Date(Date.now() - 6*60*60*1000), // قبل 6 ساعات
        resolved: true,
        code: 'FIREBASE_NETWORK_ERROR'
    }
];

// --- مكون محسن لعرض إحصائيات الأخطاء ---
const ErrorStatCard = ({ title, value, icon, color, description }) => (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg flex-shrink-0 ${color}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5 truncate">{title}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{value}</p>
                {description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
                )}
            </div>
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
    const now = new Date();
    const diffHours = Math.round((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'الآن';
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffHours < 48) return 'أمس';
    return `منذ ${Math.round(diffHours / 24)} يوم`;
};

// --- دالة لاستخراج اسم المتصفح ---
const getBrowserName = (userAgent) => {
    if (!userAgent) return 'غير معروف';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'Safari (iOS)';
    return 'غير معروف';
};

const ErrorReports = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    
    // --- جلب تقارير الأخطاء من Firebase ---
    useEffect(() => {
        const fetchErrors = async () => {
            try {
                const errorsSnapshot = await getDocs(collection(db, "error_reports"));
                let errorsList = errorsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    reportedAt: doc.data().reportedAt || new Date()
                }));
                
                // إذا لم توجد أخطاء حقيقية، استخدم البيانات التجريبية
                if (errorsList.length === 0) {
                    errorsList = DEMO_ERRORS;
                }
                
                // ترتيب حسب التاريخ (الأحدث أولاً)
                const sortedErrors = errorsList.sort((a, b) => {
                    const dateA = a.reportedAt.toDate ? a.reportedAt.toDate() : new Date(a.reportedAt);
                    const dateB = b.reportedAt.toDate ? b.reportedAt.toDate() : new Date(b.reportedAt);
                    return dateB - dateA;
                });
                
                setErrors(sortedErrors);
            } catch (error) {
                console.error("Error fetching error reports:", error);
                // في حالة الخطأ، استخدم البيانات التجريبية
                setErrors(DEMO_ERRORS);
            } finally {
                setLoading(false);
            }
        };

        fetchErrors();
    }, []);

    // --- معالجة البيانات للإحصائيات والمخططات ---
    const processedData = useMemo(() => {
        if (errors.length === 0) return { 
            stats: { total: 0, critical: 0, high: 0, medium: 0, low: 0, resolved: 0, today: 0, unresolved: 0 },
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
        
        stats.unresolved = stats.total - stats.resolved;

        // بيانات مخطط الشدة
        const severityChart = [
            { name: 'حرجة', value: stats.critical, color: '#ef4444' },
            { name: 'مهمة', value: stats.high, color: '#f97316' },
            { name: 'متوسطة', value: stats.medium, color: '#eab308' },
            { name: 'منخفضة', value: stats.low, color: '#3b82f6' }
        ].filter(item => item.value > 0);

        // بيانات مخطط السياق
        const contextCounts = errors.reduce((acc, error) => {
            const context = error.context || 'غير محدد';
            acc[context] = (acc[context] || 0) + 1;
            return acc;
        }, {});

        const contextChart = Object.entries(contextCounts)
            .map(([context, count]) => ({ name: context, errors: count }))
            .sort((a, b) => b.errors - a.errors)
            .slice(0, 6);

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
            // إذا كان خطأ تجريبي، فقط حدث الحالة المحلية
            if (errorId.startsWith('demo')) {
                setErrors(prev => prev.map(error => 
                    error.id === errorId 
                    ? { ...error, resolved: true, resolvedAt: new Date() }
                    : error
                ));
                alert('✅ تم وضع علامة على الخطأ كمحلول');
                return;
            }
            
            await updateDoc(doc(db, 'error_reports', errorId), {
                resolved: true,
                resolvedAt: new Date(),
                resolvedBy: 'admin'
            });
            
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

📍 السياق: ${error.context || 'غير محدد'}
📝 الرسالة: ${error.message}  
🔧 الكود: ${error.code || 'غير محدد'}
⚠️ الشدة: ${error.severity}

👤 معلومات المستخدم:
- المعرف: ${error.userId}
- الاسم: ${error.userName || 'غير متوفر'}
- المستوى: ${error.userLevel || 'غير معروف'}

🌐 معلومات تقنية:
- الرابط: ${error.url || 'غير محدد'}
- المتصفح: ${getBrowserName(error.userAgent)}
- وقت الحدوث: ${error.timestamp || 'غير محدد'}

⏰ وقت التقرير: ${error.reportedAt.toDate ? error.reportedAt.toDate().toLocaleString('ar-EG') : new Date(error.reportedAt).toLocaleString('ar-EG')}

${error.resolved ? '✅ تم الحل في: ' + (error.resolvedAt ? (error.resolvedAt.toLocaleString ? error.resolvedAt.toLocaleString('ar-EG') : new Date(error.resolvedAt).toLocaleString('ar-EG')) : 'غير محدد') : '❌ لم يتم الحل بعد'}
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
        <div className="p-6 space-y-8 animate-fade-in">
            {/* رأس الصفحة */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3 mb-2">
                        <AlertTriangle className="text-red-500" />
                        تقارير الأخطاء
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        مراقبة ومتابعة أخطاء التطبيق في الوقت الفعلي
                    </p>
                </div>
                
                {/* فلتر الأخطاء */}
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">فلترة:</label>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 min-w-[140px]"
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
            </div>

            {/* إحصائيات الأخطاء - محسنة */}
            <div className="space-y-6">
                {/* الصف الأول - الإحصائيات العامة */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                        <Info size={18} />
                        الإحصائيات العامة
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ErrorStatCard 
                            title="إجمالي الأخطاء" 
                            value={processedData.stats.total} 
                            icon={<Bug className="text-white" size={18} />} 
                            color="bg-slate-600" 
                        />
                        <ErrorStatCard 
                            title="محلولة" 
                            value={processedData.stats.resolved} 
                            icon={<CheckCircle className="text-white" size={18} />} 
                            color="bg-green-500" 
                            description={`${processedData.stats.total > 0 ? Math.round((processedData.stats.resolved / processedData.stats.total) * 100) : 0}% من المجموع`}
                        />
                        <ErrorStatCard 
                            title="غير محلولة" 
                            value={processedData.stats.unresolved} 
                            icon={<XCircle className="text-white" size={18} />} 
                            color="bg-gray-500" 
                            description="تحتاج انتباه"
                        />
                        <ErrorStatCard 
                            title="اليوم" 
                            value={processedData.stats.today} 
                            icon={<Clock className="text-white" size={18} />} 
                            color="bg-purple-500" 
                            description="خلال 24 ساعة"
                        />
                    </div>
                </div>
                
                {/* الصف الثاني - مستويات الشدة */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        توزيع حسب الشدة
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ErrorStatCard 
                            title="حرجة" 
                            value={processedData.stats.critical} 
                            icon={<XCircle className="text-white" size={18} />} 
                            color="bg-red-500" 
                            description="تحتاج حل فوري"
                        />
                        <ErrorStatCard 
                            title="مهمة" 
                            value={processedData.stats.high} 
                            icon={<AlertTriangle className="text-white" size={18} />} 
                            color="bg-orange-500" 
                            description="حل سريع مطلوب"
                        />
                        <ErrorStatCard 
                            title="متوسطة" 
                            value={processedData.stats.medium} 
                            icon={<AlertCircle className="text-white" size={18} />} 
                            color="bg-yellow-500" 
                            description="حل في الوقت المناسب"
                        />
                        <ErrorStatCard 
                            title="منخفضة" 
                            value={processedData.stats.low} 
                            icon={<Info className="text-white" size={18} />} 
                            color="bg-blue-500" 
                            description="حل عندما يتوفر الوقت"
                        />
                    </div>
                </div>
            </div>

            {/* المخططات البيانية */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* مخطط توزيع الشدة */}
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">توزيع الأخطاء حسب الشدة</h3>
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
                            <div className="text-center">
                                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                                <p>🎉 لا توجد أخطاء لعرضها!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* مخطط الأخطاء حسب المنطقة */}
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">الأخطاء حسب المنطقة</h3>
                    {processedData.contextChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={processedData.contextChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={80}
                                    interval={0}
                                    fontSize={12}
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="errors" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                            <div className="text-center">
                                <Info className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                                <p>📊 لا توجد بيانات لعرضها</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* قائمة الأخطاء التفصيلية */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
                    أحدث تقارير الأخطاء ({processedData.filteredErrors.length})
                </h3>
                
                {processedData.filteredErrors.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
                        <h4 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">ممتاز!</h4>
                        <p className="text-lg">لا توجد أخطاء {filter === 'all' ? '' : `في فئة "${filter}"`}</p>
                        <p className="text-sm mt-2">النظام يعمل بشكل مثالي 🚀</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {processedData.filteredErrors.slice(0, 15).map(error => (
                            <div key={error.id} className={`p-4 rounded-xl border ${error.resolved ? 'opacity-70 bg-green-50 dark:bg-green-900/10' : 'bg-white dark:bg-slate-900/50'} hover:shadow-md transition-all border-slate-200 dark:border-slate-700`}>
                                {/* رأس الخطأ */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(error.severity)}`}>
                                            {error.severity === 'critical' ? 'حرج' : 
                                             error.severity === 'high' ? 'مهم' :
                                             error.severity === 'medium' ? 'متوسط' : 'منخفض'}
                                        </span>
                                        <span className="font-medium text-slate-800 dark:text-white">{error.context}</span>
                                        {error.resolved && (
                                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                                                <CheckCircle className="w-4 h-4" />
                                                محلول
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{formatTime(error.reportedAt)}</span>
                                </div>
                                
                                {/* تفاصيل الخطأ */}
                                <div className="mb-4">
                                    <p className="text-red-600 dark:text-red-400 font-medium mb-2 leading-relaxed">{error.message}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <User size={14} />
                                            {error.userName || error.userId}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Globe size={14} />
                                            {getBrowserName(error.userAgent)}
                                        </span>
                                        {error.code && (
                                            <span className="flex items-center gap-1">
                                                <Bug size={14} />
                                                {error.code}
                                            </span>
                                        )}
                                        {error.userLevel && (
                                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
                                                مستوى {error.userLevel}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* أزرار الإجراءات */}
                                <div className="flex flex-wrap gap-2">
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
                                        <Info size={14} />
                                        التفاصيل الكاملة
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {processedData.filteredErrors.length > 15 && (
                            <div className="text-center text-slate-500 text-sm p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                و {processedData.filteredErrors.length - 15} أخطاء أخرى...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorReports;
