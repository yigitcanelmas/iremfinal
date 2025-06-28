import bcrypt from 'bcryptjs';
import { readUsers, writeUsers } from './server-utils';

import { User, LoginCredentials } from '@/types/user';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(credentials: LoginCredentials): Promise<User | null> {
  const users = readUsers();
  const user = users.find(u => u.email === credentials.email && u.isActive);
  
  if (!user) {
    return null;
  }

  // Eğer şifre hash'lenmemişse (eski kullanıcılar için)
  if (!user.password.startsWith('$2')) {
    if (credentials.password === user.password) {
      // Eski şifreyi hash'le ve güncelle
      user.password = await hashPassword(credentials.password);
      const updatedUsers = users.map(u => u.id === user.id ? user : u);
      writeUsers(updatedUsers);
      return user;
    }
    return null;
  }

  // Hash'lenmiş şifreleri karşılaştır
  const isValid = await verifyPassword(credentials.password, user.password);
  return isValid ? user : null;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return false;
  }

  const user = users[userIndex];
  
  // Mevcut şifreyi kontrol et
  let isCurrentPasswordValid = false;
  
  // Eğer şifre hash'lenmemişse (eski kullanıcılar için)
  if (!user.password.startsWith('$2')) {
    isCurrentPasswordValid = currentPassword === user.password;
  } else {
    // Hash'lenmiş şifreleri karşılaştır
    isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
  }
  
  if (!isCurrentPasswordValid) {
    return false;
  }

  // Yeni şifreyi hash'le ve güncelle
  const hashedNewPassword = await hashPassword(newPassword);
  users[userIndex].password = hashedNewPassword;
  users[userIndex].updatedAt = new Date().toISOString();
  
  writeUsers(users);
  return true;
}
