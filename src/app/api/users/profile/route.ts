import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { logActivity } from '@/lib/server-activity-logger';

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const userData = await request.json();
    
    // Gerekli alanların kontrolü
    if (!userData.userId || !userData.name) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Kullanıcıyı güncelle
    const updatedUser = await UserModel.findOneAndUpdate(
      { id: userData.userId },
      { 
        name: userData.name,
        phone: userData.phone,
        avatar: userData.avatar
      },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Aktiviteyi logla
    await logActivity({
      userId: userData.userId,
      userName: updatedUser.name,
      userEmail: updatedUser.email,
      action: 'user_update',
      description: `${updatedUser.name} profilini güncelledi`,
      targetType: 'user',
      targetId: updatedUser.id,
      status: 'success',
      details: {
        updatedFields: {
          name: userData.name,
          phone: userData.phone,
          avatar: userData.avatar
        }
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profil güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Profil güncellenemedi' },
      { status: 500 }
    );
  }
}
