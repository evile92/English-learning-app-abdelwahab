// src/data/avatars.js

export const avatarList = [
  // ✅ تم تعديل أسماء الملفات لتطابق ما لديك
  // ✅ تم تعديل القائمة لتشمل 6 صور فقط
  { id: 'avatar1', src: '/avatars/avatar1.png' },
  { id: 'avatar2', src: '/avatars/avatar2.png' },
  { id: 'avatar3', src: '/avatars/avatar3.png' },
  { id: 'avatar4', src: '/avatars/avatar4.png' },
  { id: 'avatar5', src: '/avatars/avatar5.png' },
  { id: 'avatar6', src: '/avatars/avatar6.png' },
];

// دالة مساعدة للحصول على مسار الصورة من خلال الـ ID
export const getAvatarById = (id) => {
  const avatar = avatarList.find(a => a.id === id);
  return avatar ? avatar.src : '/avatars/avatar1.png'; // صورة افتراضية في حالة عدم وجود ID
};
