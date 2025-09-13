// src/data/avatars.js

export const avatarList = [
  { id: 'avatar1', src: '/avatars/001.png' },
  { id: 'avatar2', src: '/avatars/002.png' },
  { id: 'avatar3', src: '/avatars/003.png' },
  { id: 'avatar4', src: '/avatars/004.png' },
  { id: 'avatar5', src: '/avatars/005.png' },
  { id: 'avatar6', src: '/avatars/006.png' },
  { id: 'avatar7', src: '/avatars/007.png' },
  { id: 'avatar8', src: '/avatars/008.png' },
];

// دالة مساعدة للحصول على مسار الصورة من خلال الـ ID
export const getAvatarById = (id) => {
  const avatar = avatarList.find(a => a.id === id);
  return avatar ? avatar.src : '/avatars/001.png'; // صورة افتراضية في حالة عدم وجود ID
};
