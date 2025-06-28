import fs from 'fs';
import path from 'path';
import { Property } from '@/types/property';
import { User } from '@/types/user';
import { UserActivity, ActivityAction } from '@/types/activity';

// Veri dosyası yolları
const DATA_DIR = path.join(process.cwd(), 'src/data');
const SALE_DATA_PATH = path.join(DATA_DIR, 'enhanced-sale.json');
const RENT_DATA_PATH = path.join(DATA_DIR, 'rent.json');
const USERS_DATA_PATH = path.join(DATA_DIR, 'users.json');
const ACTIVITIES_DATA_PATH = path.join(DATA_DIR, 'activities.json');

// Satılık emlakları okuma
export function readSaleProperties(): Property[] {
  try {
    const data = fs.readFileSync(SALE_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Satılık emlak verileri okunamadı:', error);
    return [];
  }
}

// Kiralık emlakları okuma
export function readRentProperties(): Property[] {
  try {
    const data = fs.readFileSync(RENT_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Kiralık emlak verileri okunamadı:', error);
    return [];
  }
}

// Tüm emlakları okuma
export function readAllProperties(): Property[] {
  const saleProperties = readSaleProperties();
  const rentProperties = readRentProperties();
  return [...saleProperties, ...rentProperties];
}

// Satılık emlakları yazma
export function writeSaleProperties(properties: Property[]): void {
  try {
    fs.writeFileSync(SALE_DATA_PATH, JSON.stringify(properties, null, 2), 'utf8');
  } catch (error) {
    console.error('Satılık emlak verileri yazılamadı:', error);
    throw new Error('Satılık emlak verileri kaydedilemedi');
  }
}

// Kiralık emlakları yazma
export function writeRentProperties(properties: Property[]): void {
  try {
    fs.writeFileSync(RENT_DATA_PATH, JSON.stringify(properties, null, 2), 'utf8');
  } catch (error) {
    console.error('Kiralık emlak verileri yazılamadı:', error);
    throw new Error('Kiralık emlak verileri kaydedilemedi');
  }
}

// Yeni emlak ekleme
export function addProperty(property: Property): void {
  if (property.type === 'sale') {
    const saleProperties = readSaleProperties();
    saleProperties.push(property);
    writeSaleProperties(saleProperties);
  } else if (property.type === 'rent') {
    const rentProperties = readRentProperties();
    rentProperties.push(property);
    writeRentProperties(rentProperties);
  } else {
    throw new Error('Geçersiz emlak tipi');
  }
}

// Emlak silme
export function deleteProperty(propertyId: string): boolean {
  // Önce satılık emlakları kontrol et
  const saleProperties = readSaleProperties();
  const saleIndex = saleProperties.findIndex(p => p.id === propertyId);
  
  if (saleIndex !== -1) {
    saleProperties.splice(saleIndex, 1);
    writeSaleProperties(saleProperties);
    return true;
  }
  
  // Sonra kiralık emlakları kontrol et
  const rentProperties = readRentProperties();
  const rentIndex = rentProperties.findIndex(p => p.id === propertyId);
  
  if (rentIndex !== -1) {
    rentProperties.splice(rentIndex, 1);
    writeRentProperties(rentProperties);
    return true;
  }
  
  return false;
}

// Emlak güncelleme
export function updateProperty(propertyId: string, updatedProperty: Property): boolean {
  // Önce satılık emlakları kontrol et
  const saleProperties = readSaleProperties();
  const saleIndex = saleProperties.findIndex(p => p.id === propertyId);
  
  if (saleIndex !== -1) {
    saleProperties[saleIndex] = updatedProperty;
    writeSaleProperties(saleProperties);
    return true;
  }
  
  // Sonra kiralık emlakları kontrol et
  const rentProperties = readRentProperties();
  const rentIndex = rentProperties.findIndex(p => p.id === propertyId);
  
  if (rentIndex !== -1) {
    rentProperties[rentIndex] = updatedProperty;
    writeRentProperties(rentProperties);
    return true;
  }
  
  return false;
}

// ID'ye göre emlak bulma
export function findPropertyById(propertyId: string): Property | null {
  const allProperties = readAllProperties();
  return allProperties.find(p => p.id === propertyId) || null;
}

// Kullanıcıları okuma
export function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Kullanıcı verileri okunamadı:', error);
    return [];
  }
}

// Kullanıcıları yazma
export function writeUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_DATA_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Kullanıcı verileri yazılamadı:', error);
    throw new Error('Kullanıcı verileri kaydedilemedi');
  }
}

// Yeni kullanıcı ekleme
export function addUser(user: User): void {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

// Kullanıcı silme
export function deleteUser(userId: string): boolean {
  const users = readUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    writeUsers(users);
    return true;
  }
  return false;
}

// Kullanıcı güncelleme
export function updateUser(userId: string, updatedUser: User): boolean {
  const users = readUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = updatedUser;
    writeUsers(users);
    return true;
  }
  return false;
}

// ID'ye göre kullanıcı bulma
export function findUserById(userId: string): User | null {
  const users = readUsers();
  return users.find(u => u.id === userId) || null;
}

// Aktivite loglarını okuma
export function readActivities(): UserActivity[] {
  try {
    const data = fs.readFileSync(ACTIVITIES_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Aktivite logları okunamadı:', error);
    return [];
  }
}

// Aktivite loglarını yazma
export function writeActivities(activities: UserActivity[]): void {
  try {
    fs.writeFileSync(ACTIVITIES_DATA_PATH, JSON.stringify(activities, null, 2), 'utf8');
  } catch (error) {
    console.error('Aktivite logları yazılamadı:', error);
    throw new Error('Aktivite logları kaydedilemedi');
  }
}

// Yeni aktivite logu ekleme
export function addActivity(activity: UserActivity): UserActivity {
  const activities = readActivities();
  
  // ID yoksa oluştur
  if (!activity.id) {
    activity.id = `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  }
  
  activities.unshift(activity); // En yeni aktiviteyi başa ekle
  
  // Son 1000 aktiviteyi tut (performans için)
  if (activities.length > 1000) {
    activities.splice(1000);
  }
  
  writeActivities(activities);
  return activity;
}

// Aktivite logu oluşturma yardımcı fonksiyonu
export function createActivity(
  userId: string,
  userName: string,
  userEmail: string,
  action: ActivityAction,
  description: string,
  ipAddress: string,
  userAgent: string,
  targetType?: 'property' | 'user' | 'system',
  targetId?: string,
  status: 'success' | 'failed' | 'warning' = 'success',
  details?: UserActivity['details']
): UserActivity {
  return {
    id: `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    userEmail,
    action,
    description,
    targetType,
    targetId,
    ipAddress,
    userAgent,
    timestamp: new Date().toISOString(),
    status,
    details
  };
}

// Kullanıcıya göre aktivite loglarını getirme
export function getActivitiesByUser(userId: string, limit: number = 50): UserActivity[] {
  const activities = readActivities();
  return activities
    .filter(activity => activity.userId === userId)
    .slice(0, limit);
}

// Son aktiviteleri getirme
export function getRecentActivities(limit: number = 100): UserActivity[] {
  const activities = readActivities();
  return activities.slice(0, limit);
}

// Aktivite tipine göre filtreleme
export function getActivitiesByAction(action: string, limit: number = 50): UserActivity[] {
  const activities = readActivities();
  return activities
    .filter(activity => activity.action === action)
    .slice(0, limit);
}

// Tarih aralığına göre aktivite getirme
export function getActivitiesByDateRange(
  startDate: string,
  endDate: string,
  limit: number = 100
): UserActivity[] {
  const activities = readActivities();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return activities
    .filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= start && activityDate <= end;
    })
    .slice(0, limit);
}

// IP adresine göre aktivite getirme
export function getActivitiesByIP(ipAddress: string, limit: number = 50): UserActivity[] {
  const activities = readActivities();
  return activities
    .filter(activity => activity.ipAddress === ipAddress)
    .slice(0, limit);
}

// Aktivite istatistikleri
export function getActivityStats(): {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  monthActivities: number;
  topActions: { action: string; count: number }[];
  topUsers: { userId: string; userName: string; count: number }[];
} {
  const activities = readActivities();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const todayActivities = activities.filter(a => new Date(a.timestamp) >= today).length;
  const weekActivities = activities.filter(a => new Date(a.timestamp) >= weekAgo).length;
  const monthActivities = activities.filter(a => new Date(a.timestamp) >= monthAgo).length;

  // En çok yapılan işlemler
  const actionCounts: Record<string, number> = {};
  activities.forEach(activity => {
    actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1;
  });
  const topActions = Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // En aktif kullanıcılar
  const userCounts: Record<string, { userName: string; count: number }> = {};
  activities.forEach(activity => {
    if (!userCounts[activity.userId]) {
      userCounts[activity.userId] = { userName: activity.userName, count: 0 };
    }
    userCounts[activity.userId].count++;
  });
  const topUsers = Object.entries(userCounts)
    .map(([userId, data]) => ({ userId, userName: data.userName, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalActivities: activities.length,
    todayActivities,
    weekActivities,
    monthActivities,
    topActions,
    topUsers
  };
}

// Aktivite loglama yardımcı fonksiyonu
export function logActivity(
  userId: string,
  userName: string,
  userEmail: string,
  action: ActivityAction,
  description: string,
  ipAddress: string = '127.0.0.1',
  userAgent: string = 'Unknown',
  targetType?: 'property' | 'user' | 'system',
  targetId?: string,
  status: 'success' | 'failed' | 'warning' = 'success',
  details?: UserActivity['details']
): void {
  const activity = createActivity(
    userId,
    userName,
    userEmail,
    action,
    description,
    ipAddress,
    userAgent,
    targetType,
    targetId,
    status,
    details
  );
  
  addActivity(activity);
}
