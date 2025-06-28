import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';

export async function GET() {
  try {
    await dbConnect();
    const agents = await Agent.find({ isActive: true }).sort({ createdAt: -1 });
    
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Emlak danışmanları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const agent = new Agent(body);
    await agent.save();
    
    return NextResponse.json(agent, { status: 201 });
  } catch (error: any) {
    console.error('Error creating agent:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Emlak danışmanı eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const agent = await Agent.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Emlak danışmanı bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Emlak danışmanı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Emlak danışmanı ID gerekli' },
        { status: 400 }
      );
    }
    
    const agent = await Agent.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Emlak danışmanı bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Emlak danışmanı başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Emlak danışmanı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
