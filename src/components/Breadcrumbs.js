// src/components/Breadcrumbs.js - ملف جديد
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Breadcrumbs = () => {
  const { page, handlePageChange } = useAppContext();

  const breadcrumbsData = {
    'dashboard': [{ name: 'الرئيسية', page: 'dashboard' }],
    'lessons': [
      { name: 'الرئيسية', page: 'dashboard' },
      { name: 'الدروس', page: 'lessons' }
    ],
    'grammar': [
      { name: 'الرئيسية', page: 'dashboard' },
      { name: 'الدروس', page: 'lessons' },
      { name: 'دليل القواعد', page: 'grammar' }
    ],
    'vocabulary': [
      { name: 'الرئيسية', page: 'dashboard' },
      { name: 'مفرداتي', page: 'vocabulary' }
    ],
    'pronunciation': [
      { name: 'الرئيسية', page: 'dashboard' },
      { name: 'الدروس', page: 'lessons' },
      { name: 'مدرب النطق', page: 'pronunciation' }
    ],
    'listening': [
      { name: 'الرئيسية', page: 'dashboard' },
      { name: 'الدروس', page: 'lessons' },
      { name: 'مركز الاستماع', page: 'listening' }
    ],
    'blog': [
      { name: 'الرئيسية', page: 'dashboard' },
      { name: 'المدونة', page: 'blog' }
    ]
  };

  const currentBreadcrumbs = breadcrumbsData[page] || breadcrumbsData['dashboard'];

  if (currentBreadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
      <Home size={16} />
      {currentBreadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.page}>
          {index > 0 && <ChevronRight size={14} className="mx-1" />}
          {index === currentBrea// src/components/Breadcrumbs.js - ملف جديد
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handlePageChange } = useAppContext();

  const breadcrumbsData = {
    '/': [{ name: 'الرئيسية', path: '/' }],
    '/lessons': [
      { name: 'الرئيسية', path: '/' },
      { name: 'الدروس', path: '/lessons' }
    ],
    '/grammar': [
      { name: 'الرئيسية', path: '/' },
      { name: 'الدروس', path: '/lessons' },
      { name: 'دليل القواعد', path: '/grammar' }
    ],
    '/vocabulary': [
      { name: 'الرئيسية', path: '/' },
      { name: 'مفرداتي', path: '/vocabulary' }
    ],
    '/pronunciation': [
      { name: 'الرئيسية', path: '/' },
      { name: 'الدروس', path: '/lessons' },
      { name: 'مدرب النطق', path: '/pronunciation' }
    ],
    '/listening': [
      { name: 'الرئيسية', path: '/' },
      { name: 'الدروس', path: '/lessons' },
      { name: 'مركز الاستماع', path: '/listening' }
    ],
    '/blog': [
      { name: 'الرئيسية', path: '/' },
      { name: 'المدونة', path: '/blog' }
    ]
  };

  const currentBreadcrumbs = breadcrumbsData[location.pathname] || breadcrumbsData['/'];

  if (currentBreadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
      <Home size={16} />
      {currentBreadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <ChevronRight size={14} className="mx-1" />}
          {index === currentBreadcrumbs.length - 1 ? (
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {crumb.name}
            </span>
          ) : (
            <button
              onClick={() => navigate(crumb.path)}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              {crumb.name}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
dcrumbs.length - 1 ? (
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {crumb.name}
            </span>
          ) : (
            <button
              onClick={() => handlePageChange(crumb.page)}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              {crumb.name}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
