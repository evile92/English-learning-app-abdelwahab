// src/data/avatars.js

export const avatarList = [
  // الصور الستة الحالية
  { id: 'avatar1', src: '/avatars/avatar1.png' },
  { id: 'avatar2', src: '/avatars/avatar2.png' },
  { id: 'avatar3', src: '/avatars/avatar3.png' },
  { id: 'avatar4', src: '/avatars/avatar4.png' },
  { id: 'avatar5', src: '/avatars/avatar5.png' },
  { id: 'avatar6', src: '/avatars/avatar6.png' },
  
  // ✅ الصور الخمسة الجديدة التي تمت إضافتها
  { id: 'avatar7', src: '/avatars/avatar7.png' },
  { id: 'avatar8', src: '/avatars/avatar8.png' },
  { id: 'avatar9', src: '/avatars/avatar9.png' },
  { id: 'avatar10', src: '/avatars/avatar10.png' },
  { id: 'avatar11', src: '/avatars/avatar11.png' },
];

// دالة مساعدة للحصول على مسار الصورة من خلال الـ ID
export const getAvatarById = (id) => {
  const avatar = avatarList.find(a => a.id === id);
  // ستبقى الصورة الافتراضية كما هي في حال حدوث أي خطأ
  return avatar ? avatar.src : '/avatars/avatar1.png'; 
};
