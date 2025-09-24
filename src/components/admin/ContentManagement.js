// src/components/admin/ContentManagement.js

import React from 'react';
import BlogManagement from './BlogManagement';

const ContentManagement = () => {
    return (
        <div>
            {/* حالياً يحتوي فقط على إدارة المدونة، يمكن إضافة المزيد لاحقاً */}
            <BlogManagement />
        </div>
    );
};

export default ContentManagement;
