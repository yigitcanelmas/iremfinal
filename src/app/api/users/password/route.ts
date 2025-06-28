import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { verifyPassword, hashPassword } from '@/lib/auth';
import { logActivity } from '@/lib/server-activity-logger';

// PUT - Şifre değiştir
export async function PUT(request: NextRequest) {
  try {
    const { userId, currentPassword, newPassword } = await request.json();

    console.log('Password change request:', { userId, currentPassword: '***', newPassword: '***' });

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: `Gerekli alanlar eksik - userId: ${userId}, currentPassword: ${!!currentPassword}, newPassword: ${!!newPassword}` },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Yeni şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Kullanıcıyı bul
    const user = await UserModel.findOne({ id: userId });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Mevcut şifreyi doğrula
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      // Başarısız şifre değiştirme denemesini logla
      await logActivity({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: 'password_change',
        description: 'Şifre değiştirme işlemi başarısız - Mevcut şifre yanlış',
        targetType: 'user',
        targetId: user.id,
        status: 'failed',
        details: { 
          reason: 'Mevcut şifre yanlış' 
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Unknown'
      });

      return NextResponse.json(
        { error: 'Mevcut şifre yanlış' },
        { status: 400 }
      );
    }

    // Yeni şifreyi hashle
    const hashedNewPassword = await hashPassword(newPassword);

    // Şifreyi güncelle
    await UserModel.findOneAndUpdate(
      { id: userId },
      { password: hashedNewPassword }
    );

    // Başarılı şifre değiştirme aktivitesini logla
    await logActivity({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'password_change',
      description: `${user.name} şifresini değiştirdi`,
      targetType: 'user',
      targetId: user.id,
      status: 'success',
      details: {
        changeTime: new Date().toISOString()
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json(
      { message: 'Şifre başarıyla değiştirildi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    return NextResponse.json(
      { error: 'Şifre değiştirilemedi' },
      { status: 500 }
    );
  }
}
