import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';
import { logActivity } from '@/lib/server-activity-logger';
interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: Props) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const property = await Property.findOne({ id });

    if (!property) {
      return NextResponse.json(
        { error: 'Emlak bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Property Detail API Error:', error);
    return NextResponse.json(
      { error: 'Emlak detayları yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    
    // Güncelleme öncesi mevcut property'yi al
    const oldProperty = await Property.findOne({ id });
    
    if (!oldProperty) {
      return NextResponse.json(
        { error: 'Emlak bulunamadı' },
        { status: 404 }
      );
    }

    const property = await Property.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );

    // Değişiklikleri tespit et
    const changes: any = {};
    const fieldsToCheck = ['title', 'price', 'type', 'category', 'description', 'location', 'specs'];
    
    fieldsToCheck.forEach(field => {
      if (JSON.stringify(oldProperty[field]) !== JSON.stringify(body[field])) {
        changes[field] = {
          old: oldProperty[field],
          new: body[field]
        };
      }
    });

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'property_update',
      description: `${property.title} başlıklı emlak güncellendi`,
      targetType: 'property',
      targetId: property.id,
      status: 'success',
      details: {
        changes,
        updatedFields: Object.keys(changes)
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Property Update API Error:', error);
    return NextResponse.json(
      { error: 'Emlak güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const property = await Property.findOne({ id });

    if (!property) {
      return NextResponse.json(
        { error: 'Emlak bulunamadı' },
        { status: 404 }
      );
    }

    // Cloudinary'den resimleri sil
    if (property.images && property.images.length > 0) {
      const deletePromises = property.images.map(async (imageUrl: string) => {
        try {
          // URL'den public ID çıkar (irem-properties/filename formatında)
          const urlParts = imageUrl.split('/');
          const fileName = urlParts[urlParts.length - 1].split('.')[0];
          const publicId = `irem-properties/${fileName}`;
          
          return await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error('Cloudinary resim silme hatası:', error);
          return false;
        }
      });

      await Promise.all(deletePromises);
    }

    // Silme işleminden önce property detaylarını kaydet
    const propertyDetails = {
      id: property.id,
      title: property.title,
      type: property.type,
      category: property.category,
      price: property.price,
      location: property.location,
      specs: property.specs
    };

    // MongoDB'den emlakı sil
    await Property.findOneAndDelete({ id });

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'property_delete',
      description: `${property.title} başlıklı emlak silindi`,
      targetType: 'property',
      targetId: property.id,
      status: 'success',
      details: {
        deletedProperty: propertyDetails,
        deletedImages: property.images?.length || 0
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });

    return NextResponse.json(
      { message: 'Emlak ve resimleri başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Property Delete API Error:', error);
    return NextResponse.json(
      { error: 'Emlak silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
