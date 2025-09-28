import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
// تم تصحيح هذا السطر بإضافة أيقونة Hash
import { AlertTriangle, CheckCircle, Loader, Bug, XCircle, Info, Code, Smartphone, Monitor, Globe, Trash2, RefreshCw, Filter, User, X, Hash } from 'lucide-react';

// ====================================================================
// ============  مكون النافذة المنبثقة المدمج هنا مباشرة  =============
// ====================================================================
const DetailRow = ({ icon: Icon, label, value, isCode = false }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-4 py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
            <Icon className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                {isCode ? (
                    <pre className="text-sm text-slate-800 dark:text-slate-100 break-words whitespace-pre-wrap font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded-md mt-1"><code>{value}</code></pre>
                ) : (
                    <p className="text-base text-slate-800 dark:text-slate-100 break-words">{value}</p>
                )}
            </div>
        </div>
    );
};

const ErrorDetailModal = ({ error, onClose }) => {
  if (!error) return null;

  const { message, context, severity, code, user, environment, errorDetails } = error;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-red-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Error Details</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <DetailRow icon={Info} label="Error Message" value={message} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
            <DetailRow icon={Code} label="Context" value={context} />
            <DetailRow icon={AlertTriangle} label="Severity" value={severity} />
            <DetailRow icon={Hash} label="Error Code" value={code} />
          </div>
          <hr className="my-2 border-slate-200 dark:border-slate-700"/>
          <DetailRow icon={User} label="User" value={`${user?.name || 'N/A'} (Level: ${user?.level || 'N/A'})`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <DetailRow icon={Monitor} label="Screen Size" value={environment?.screenSize} />
            <DetailRow icon={Globe} label="Online" value={environment?.isOnline ? 'Yes' : 'No'} />
          </div>
          <DetailRow icon={Smartphone} label="User Agent" value={environment?.userAgent} />
          
          {(errorDetails?.stack || errorDetails?.componentStack) && (
             <hr className="my-2 border-slate-200 dark:border-slate-700"/>
          )}
          <DetailRow icon={Code} label="Stack Trace" value={errorDetails?.stack} isCode={true}/>
          <DetailRow icon={Code} label="Component Stack" value={errorDetails?.componentStack} isCode={true} />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
// ====================================================================
// ===================  نهاية مكون النافذة المنبثقة  ==================
// ====================================================================


const ErrorStatCard = ({ title, value, icon, color, description }) => (
    <div className="bg-white dark:bg-slate-800/50 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${color}`}>{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{title}</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{value}</p>
                {description && <p className="text-xs text-slate-400 truncate">{description}</p>}
            </div>
        </div>
    </div>
);

const getSeverityColor = (severity) => ({
    critical: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20',
    high: 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20',
    low: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20'
}[severity] || 'text-gray-600 bg-gray-50 border-gray-200');

const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 5) return 'Now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
};

const getBrowserName = (userAgent) => {
    if (!userAgent) return { name: 'Unknown', icon: Globe };
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
        if (userAgent.includes('Chrome')) return { name: 'Chrome Mobile', icon: Smartphone };
        if (userAgent.includes('Safari')) return { name: 'Safari Mobile', icon: Smartphone };
        if (userAgent.includes('Firefox')) return { name: 'Firefox Mobile', icon: Smartphone };
        return { name: 'Mobile Browser', icon: Smartphone };
    }
    if (userAgent.includes('Chrome')) return { name: 'Chrome', icon: Monitor };
    if (userAgent.includes('Firefox')) return { name: 'Firefox', icon: Monitor };
    if (userAgent.includes('Safari')) return { name: 'Safari', icon: Monitor };
    if (userAgent.includes('Edge')) return { name: 'Edge', icon: Monitor };
    return { name: 'Unknown', icon: Globe };
};

const getErrorTypeDisplay = (code) => {
    const types = {
        'FIREBASE_PERMISSION_DENIED': '🔐 Permission Denied',
        'FIREBASE_NETWORK_ERROR': '🌐 Network Error',
        'FIREBASE_QUOTA_EXCEEDED': '⚡ Quota Exceeded',
        'API_TIMEOUT': '⏱️ Timeout',
        'API_RATE_LIMIT': '🚦 Rate Limit',
        'API_INVALID_RESPONSE': '📡 Invalid Response',
        'API_SERVER_ERROR': '🔥 Server Error',
        'VALIDATION_ERROR': '✅ Validation Error',
        'RENDER_ERROR': '🎨 Render Error',
        'UNKNOWN_ERROR': '❓ Unknown'
    };
    return types[code] || '❓ Undefined';
};

const truncateText = (text, maxLength = 100) => {
    if (!text || typeof text !== 'string') return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const ErrorReports = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [refreshing, setRefreshing] = useState(false);
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [selectedError, setSelectedError] = useState(null); 

    const fetchErrors = async () => {
        setRefreshing(true);
        try {
            const errorsSnapshot = await getDocs(collection(db, "error_reports"));
            const errorsList = errorsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                reportedAt: doc.data().reportStatus?.reportedAt || doc.data().reportedAt || new Date()
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
            resolved: errors.filter(e => e.reportStatus?.isResolved || e.resolved).length,
            unresolved: errors.filter(e => !(e.reportStatus?.isResolved || e.resolved)).length,
            today: errors.filter(e => {
                const date = e.reportedAt.toDate ? e.reportedAt.toDate() : new Date(e.reportedAt);
                return date >= new Date(new Date().setHours(0, 0, 0, 0));
            }).length
        };

        const filteredErrors = errors.filter(error => {
            if (filter === 'all') return true;
            if (filter === 'resolved') return error.reportStatus?.isResolved || error.resolved;
            if (filter === 'unresolved') return !(error.reportStatus?.isResolved || error.resolved);
            return error.severity === filter;
        });

        return { stats, filteredErrors };
    }, [errors, filter]);

    const markAsResolved = async (errorId) => {
        try {
            await updateDoc(doc(db, 'error_reports', errorId), {
                'reportStatus.isResolved': true,
                'reportStatus.resolvedAt': new Date(),
                'reportStatus.resolvedBy': 'admin'
            });
            fetchErrors();
        } catch (error) {
            console.error('Failed to update error:', error);
            alert('❌ فشل في تحديث حالة الخطأ');
        }
    };

    const deleteError = async (errorId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الخطأ؟')) return;
        
        setDeletingIds(prev => new Set(prev).add(errorId));
        try {
            await deleteDoc(doc(db, 'error_reports', errorId));
            setErrors(prev => prev.filter(error => error.id !== errorId));
        } catch (error) {
            console.error('Failed to delete error:', error);
            alert('❌ فشل في حذف الخطأ');
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(errorId);
                return newSet;
            });
        }
    };

    const viewErrorDetails = (error) => {
        setSelectedError(error);
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
        <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
            <ErrorDetailModal error={selectedError} onClose={() => setSelectedError(null)} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3 mb-2">
                        <AlertTriangle className="text-red-500" size={28} />
                        Error Reports
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Last updated: {new Date().toLocaleString('en-US')}
                        {processedData.stats.total > 0 && ` • ${processedData.stats.unresolved} unresolved`}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    >
                        <option value="all">All Errors ({processedData.stats.total})</option>
                        <option value="critical">Critical ({processedData.stats.critical})</option>
                        <option value="high">High ({processedData.stats.high})</option>
                        <option value="medium">Medium ({processedData.stats.medium})</option>
                        <option value="low">Low ({processedData.stats.low})</option>
                        <option value="resolved">Resolved ({processedData.stats.resolved})</option>
                        <option value="unresolved">Unresolved ({processedData.stats.unresolved})</option>
                    </select>
                    
                    <button
                        onClick={fetchErrors}
                        disabled={refreshing}
                        className="px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-slate-400 flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                        <RefreshCw className={refreshing ? 'animate-spin' : ''} size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ErrorStatCard 
                    title="Total Errors" 
                    value={processedData.stats.total} 
                    icon={<Bug className="text-white" size={14} />} 
                    color="bg-slate-600"
                />
                <ErrorStatCard 
                    title="Unresolved" 
                    value={processedData.stats.unresolved} 
                    icon={<XCircle className="text-white" size={14} />} 
                    color="bg-red-500"
                />
                <ErrorStatCard 
                    title="Resolved" 
                    value={processedData.stats.resolved} 
                    icon={<CheckCircle className="text-white" size={14} />} 
                    color="bg-green-500"
                />
                <ErrorStatCard 
                    title="Today" 
                    value={processedData.stats.today} 
                    icon={<AlertTriangle className="text-white" size={14} />} 
                    color="bg-purple-500"
                />
            </div>

            {/* Error List */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-between">
                        <span>Recent Errors ({processedData.filteredErrors.length})</span>
                        {processedData.filteredErrors.length > 20 && (
                            <span className="text-sm font-normal text-slate-500">Showing latest 20</span>
                        )}
                    </h3>
                </div>
                
                {processedData.filteredErrors.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <h4 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">Excellent!</h4>
                        <p className="text-base">No errors {filter === 'all' ? '' : `in "${filter}" category`}</p>
                        <p className="text-sm mt-2">System is running perfectly 🚀</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
                        {processedData.filteredErrors.slice(0, 20).map(error => {
                            const browserInfo = getBrowserName(error.environment?.userAgent || error.userAgent);
                            const BrowserIcon = browserInfo.icon;
                            const isDeleting = deletingIds.has(error.id);
                            const isResolved = error.reportStatus?.isResolved || error.resolved;
                            
                            return (
                                <div key={error.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors ${isResolved ? 'opacity-70' : ''}`}>
                                    {/* Error Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(error.severity)}`}>
                                                {error.severity === 'critical' ? '🚨 Critical' : 
                                                 error.severity === 'high' ? '⚠️ High' :
                                                 error.severity === 'medium' ? '🟡 Medium' : '🔵 Low'}
                                            </span>
                                            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                {truncateText(error.context, 25)}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {getErrorTypeDisplay(error.code)}
                                            </span>
                                            {isResolved && (
                                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                                                    <CheckCircle size={12} />
                                                    Resolved
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                                            {formatTime(error.reportedAt)}
                                        </span>
                                    </div>
                                    
                                    {/* Error Message */}
                                    <div className="mb-3">
                                        <p className="text-red-600 dark:text-red-400 font-medium text-sm leading-relaxed break-words">
                                            {truncateText(error.message, 200)}
                                        </p>
                                    </div>
                                    
                                    {/* User & Browser Info */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            👤 {truncateText(error.user?.name || error.userName || error.user?.id || error.userId, 15)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BrowserIcon size={12} />
                                            {browserInfo.name}
                                        </span>
                                        {(error.user?.level || error.userLevel) && (
                                            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
                                                📚 {error.user?.level || error.userLevel}
                                            </span>
                                        )}
                                        {(error.errorDetails?.errorBoundary || error.errorBoundary) && (
                                            <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs">
                                                ⚛️ React
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2 justify-between items-center">
                                        <div className="flex gap-2">
                                            {!isResolved && (
                                                <button
                                                    onClick={() => markAsResolved(error.id)}
                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                                                >
                                                    <CheckCircle size={12} />
                                                    Mark Resolved
                                                </button>
                                            )}
                                            <button
                                                onClick={() => viewErrorDetails(error)}
                                                className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                                            >
                                                <Code size={12} />
                                                Details
                                            </button>
                                            <button
                                                onClick={() => deleteError(error.id)}
                                                disabled={isDeleting}
                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1 disabled:bg-red-400"
                                            >
                                                {isDeleting ? (
                                                    <Loader className="animate-spin" size={12} />
                                                ) : (
                                                    <Trash2 size={12} />
                                                )}
                                                Delete
                                            </button>
                                        </div>
                                        
                                        {isResolved && (error.reportStatus?.resolvedAt || error.resolvedAt) && (
                                            <span className="text-xs text-green-600 dark:text-green-400">
                                                ✅ Resolved {formatTime(error.reportStatus?.resolvedAt || error.resolvedAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        
                        {processedData.filteredErrors.length > 20 && (
                            <div className="text-center text-slate-500 text-sm p-4 bg-slate-50 dark:bg-slate-800/50">
                                And {processedData.filteredErrors.length - 20} more errors... 
                                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sky-500 hover:underline ml-2">
                                    Back to Top
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
