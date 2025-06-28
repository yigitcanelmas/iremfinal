import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { verifyPassword } from '@/lib/auth';
import { LoginCredentials, User } from '@/types/user';
import { logActivity } from '@/lib/server-activity-logger';

export async function POST(request: Request) {
  try {
    const credentials: LoginCredentials = await request.json();

    if (!credentials.email || !credentials.password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Kullanıcıyı email ile bul
    const user = await UserModel.findOne({ 
      email: credentials.email,
      isActive: true 
    }).lean() as User | null;

    if (!user) {
      console.log(`Başarısız giriş denemesi: ${credentials.email} - Kullanıcı bulunamadı`);
      
      // Başarısız giriş denemesini logla
      await logActivity({
        userId: 'unknown',
        userName: 'Unknown User',
        userEmail: credentials.email,
        action: 'user_login',
        description: `Başarısız giriş denemesi: ${credentials.email} - Kullanıcı bulunamadı`,
        targetType: 'auth',
        targetId: credentials.email,
        status: 'failed',
        details: {
          reason: 'User not found',
          email: credentials.email
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Unknown'
      });

      return NextResponse.json(
        { error: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    // Şifreyi doğrula
    const isPasswordValid = await verifyPassword(credentials.password, user.password);

    if (!isPasswordValid) {
      console.log(`Başarısız giriş denemesi: ${credentials.email} - Geçersiz şifre`);
      
      // Başarısız giriş denemesini logla
      await logActivity({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: 'user_login',
        description: `Başarısız giriş denemesi: ${user.email} - Geçersiz şifre`,
        targetType: 'auth',
        targetId: user.id,
        status: 'failed',
        details: {
          reason: 'Invalid password',
          email: user.email
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Unknown'
      });

      return NextResponse.json(
        { error: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    // Son giriş zamanını güncelle
    await UserModel.findOneAndUpdate(
      { id: user.id },
      { lastLogin: new Date().toISOString() }
    );

    console.log(`Başarılı giriş: ${user.name} (${user.email})`);

    // Başarılı giriş aktivitesini logla
    await logActivity({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'user_login',
      description: `${user.name} başarıyla giriş yaptı`,
      targetType: 'auth',
      targetId: user.id,
      status: 'success',
      details: {
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString()
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    // Şifreyi response'dan çıkar
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Giriş başarılı'
    });

  } catch (error) {
    console.error('Login hatası:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
