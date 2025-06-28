import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { User, CreateUserData } from '@/types/user';
import { logActivity } from '@/lib/server-activity-logger';

// GET /api/users - Tüm kullanıcıları getir
export async function GET() {
  try {
    await dbConnect();
    const users = await UserModel.find({}, '-password').lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Kullanıcılar getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST /api/users - Yeni kullanıcı ekle
export async function POST(request: Request) {
  try {
    await dbConnect();
    const userData: CreateUserData = await request.json();
    
    // Gerekli alanların kontrolü
    if (!userData.email || !userData.name || !userData.password || !userData.role) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik (email, name, password, role)' },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (userData.password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }

    // Email benzersizliği kontrolü
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(userData.password);

    // Kullanıcı sayısını al ve ID oluştur
    const userCount = await UserModel.countDocuments();
    const userId = `U${String(userCount + 1).padStart(3, '0')}`;

    // Avatar URL'ini belirle (eğer gönderilmişse kullan, yoksa varsayılan)
    const avatarUrl = userData.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`;

    // Yeni kullanıcı objesi oluştur
    const newUser = new UserModel({
      id: userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword,
      role: userData.role,
      avatar: avatarUrl,
      isActive: true
    });

    // Kullanıcıyı kaydet
    await newUser.save();
    
    // Şifreyi response'dan çıkar
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'user_create',
      description: `${newUser.name} adlı yeni kullanıcı oluşturuldu`,
      targetType: 'user',
      targetId: newUser.id,
      status: 'success',
      details: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Kullanıcı eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı eklenemedi' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Kullanıcıları güncelle
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const updatedUsers: User[] = await request.json();
    
    // Her kullanıcıyı güncelle
    const updatePromises = updatedUsers.map(async (userData) => {
      const { _id, password, ...updateData } = userData as any;
      return await UserModel.findOneAndUpdate(
        { id: userData.id },
        updateData,
        { new: true, select: '-password' }
      );
    });

    const results = await Promise.all(updatePromises);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Kullanıcılar güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE /api/users?id={userId} - Kullanıcı sil
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID\'si gerekli' },
        { status: 400 }
      );
    }

    // Silinecek kullanıcıyı bul ve sil
    const deletedUser = await UserModel.findOneAndDelete({ id: userId });
    
    if (!deletedUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'user_delete',
      description: `${deletedUser.name} adlı kullanıcı silindi`,
      targetType: 'user',
      targetId: deletedUser.id,
      status: 'success',
      details: {
        deletedUser: {
          name: deletedUser.name,
          email: deletedUser.email,
          role: deletedUser.role
        }
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kullanıcı silinirken hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı silinemedi' },
      { status: 500 }
    );
  }
}
