import dbConnect from '@/lib/mongodb';
import ActivityModel from '@/models/Activity';
import mongoose from 'mongoose';

export async function logActivity(activityData: {
  userId: string;
  userName: string;
  userEmail?: string;
  action: string;
  description: string;
  targetType?: string;
  targetId?: string;
  status?: 'success' | 'failed' | 'warning';
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  let db;
  try {
    // MongoDB bağlantısını kontrol et
    db = await dbConnect();
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    // Aktivite ID'si oluştur - timestamp bazlı
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 5);
    const activityId = `ACT${timestamp}${random}`;

    // Aktivite verilerini hazırla
    const activityDoc = {
      id: activityId,
      ...activityData,
      timestamp: new Date(),
      status: activityData.status || 'success'
    };

    console.log('Creating activity:', {
      id: activityId,
      action: activityData.action,
      description: activityData.description,
      userId: activityData.userId,
      targetType: activityData.targetType
    });

    // Yeni aktivite oluştur
    const newActivity = new ActivityModel(activityDoc);

    // Aktiviteyi kaydet
    const savedActivity = await newActivity.save();
    
    console.log('Activity successfully logged:', {
      id: savedActivity.id,
      action: savedActivity.action,
      status: savedActivity.status
    });

    return savedActivity;
  } catch (error) {
    // Detaylı hata loglaması
    console.error('Activity logging error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      mongoState: mongoose.connection.readyState,
      activityData: {
        action: activityData.action,
        userId: activityData.userId,
        targetType: activityData.targetType
      }
    });

    // Hata durumunda da devam et ama null döndür
    return null;
  }
}
