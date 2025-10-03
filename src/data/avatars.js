// src/data/avatars.js

export const avatarList = [
  // الصور الستة الحالية
  { id: 'avatar1', src: '/avatars/avatar1.webp' },
  { id: 'avatar2', src: '/avatars/avatar2.webp' },
  { id: 'avatar3', src: '/avatars/avatar3.webp' },
  { id: 'avatar4', src: '/avatars/avatar4.webp' },
  { id: 'avatar5', src: '/avatars/avatar5.webp' },
  { id: 'avatar6', src: '/avatars/avatar6.webp' },
  
  // ✅ الصور الخمسة الجديدة التي تمت إضافتها
  { id: 'avatar7', src: '/avatars/avatar7.webp' },
  { id: 'avatar8', src: '/avatars/avatar8.webp' },
  { id: 'avatar9', src: '/avatars/avatar9.webp' },
  { id: 'avatar10', src: '/avatars/avatar10.webp' },
  { id: 'avatar11', src: '/avatars/avatar11.webp' },
];

// دالة مساعدة للحصول على مسار الصورة من خلال الـ ID
export const getAvatarById = (id) => {
  const avatar = avatarList.find(a => a.id === id);
  // ستبقى الصورة الافتراضية كما هي في حال حدوث أي خطأ
  return avatar ? avatar.src : '/avatars/avatar1.webp'; 
};
