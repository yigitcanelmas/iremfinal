import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const user = await UserModel.findOne({ id }, '-password').lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı getirilemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const updateData = await request.json();

    // Password field'ını güncelleme işleminden çıkar
    const { password, _id, ...dataToUpdate } = updateData;

    const user = await UserModel.findOneAndUpdate(
      { id },
      dataToUpdate,
      { new: true, select: '-password' }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı güncellenemedi' },
      { status: 500 }
    );
  }
}
