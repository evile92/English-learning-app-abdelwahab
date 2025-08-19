// src/components/PageRouter.js

import React from 'react';
import { useAppContext } from '../context/AppContext';

// استيراد كل مكونات الصفحات
import WelcomeScreen from './WelcomeScreen';
import PlacementTest from './PlacementTest';
import NameEntryScreen from './NameEntryScreen';
import Dashboard from './Dashboard';
import LessonView from './LessonView';
import LessonContent from './LessonContent';
import WritingSection from './WritingSection';
import ReadingCenter from './ReadingCenter';
import RolePlaySection from './RolePlaySection';
import PronunciationCoach from './PronunciationCoach';
import ReviewSection from './ReviewSection';
import Login from './Login';
import Register from './Register';
import ProfilePage from './ProfilePage';
import EditProfilePage from './EditProfilePage';
import MyVocabulary from './MyVocabulary';
import ReviewSession from './ReviewSession';
import Certificate from './Certificate';

// ... استورد أي مكونات أخرى تحتاجها

const PageRouter = () => {
    const { page, setPage, userLevel, ...props } = useAppContext(); // ...props تحتوي على كل شيء آخر من الـ context

    // منطق عرض الصفحات الذي كان في App.js
    if (!userLevel && (page === 'welcome' || page === 'test' || page === 'nameEntry')) {
        if(page === 'welcome') return <WelcomeScreen onStart={() => setPage('test')} />;
        if(page === 'test') return <PlacementTest onTestComplete={(level) => { props.setUserLevel(level); setPage('nameEntry'); }} initialLevels={props.initialLevels} />;
        if(page === 'nameEntry') return <NameEntryScreen onNameSubmit={(name) => { props.setUserName(name); setPage('dashboard'); }} />;
    }
    
    // ... بقية منطق عرض الصفحات
    // ...

    switch (page) {
        case 'dashboard': return <Dashboard {...props} />;
        case 'writing': return <WritingSection />;
        // ... وهكذا لكل الصفحات
        default: return <Dashboard {...props} />;
    }
};

export default PageRouter;
