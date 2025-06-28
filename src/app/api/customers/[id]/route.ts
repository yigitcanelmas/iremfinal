import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { logActivity } from '@/lib/server-activity-logger';

type RouteContext = {
  params: {
    id: string;
  };
};

// GET - Tek müşteri getir
export async function GET(
  request: NextRequest,
  context: any
) {
  const { params } = context as RouteContext;
  try {
    await dbConnect();
    
    const customer = await Customer.findOne({ id: params.id });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Müşteri getirilirken hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT - Müşteri güncelle
export async function PUT(
  request: NextRequest,
  context: any
) {
  const { params } = context as RouteContext;
  try {
    await dbConnect();
    
    const body = await request.json();
    const headers = request.headers;
    
    // User bilgilerini header'dan al
    const userId = headers.get('x-user-id') || 'system';
    const userName = headers.get('x-user-name') || 'System User';
    const userEmail = headers.get('x-user-email') || 'system@example.com';

    // Mevcut müşteriyi bul
    const existingCustomer = await Customer.findOne({ id: params.id });
    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      );
    }

    // Güncelleme verilerini hazırla
    const updateData = {
      ...body,
      lastUpdatedBy: {
        userId: decodeURIComponent(userId.replace(/_/g, '%')),
        userName: decodeURIComponent(userName.replace(/_/g, '%'))
      },
      updatedAt: new Date().toISOString()
    };

    // Müşteriyi güncelle
    const updatedCustomer = await Customer.findOneAndUpdate(
      { id: params.id },
      updateData,
      { new: true, runValidators: true }
    );

    // Aktivite logla
    await logActivity({
      action: 'customer_updated',
      description: `Müşteri güncellendi: ${updatedCustomer.firstName} ${updatedCustomer.lastName}`,
      userId: decodeURIComponent(userId.replace(/_/g, '%')),
      userName: decodeURIComponent(userName.replace(/_/g, '%')),
      userEmail: decodeURIComponent(userEmail.replace(/_/g, '%')),
      targetType: 'customer',
      targetId: updatedCustomer._id.toString(),
      details: {
        customerId: updatedCustomer._id.toString(),
        customerName: `${updatedCustomer.firstName} ${updatedCustomer.lastName}`,
        changes: getChanges(existingCustomer.toObject(), updatedCustomer.toObject())
      }
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Müşteri güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Müşteri sil
export async function DELETE(
  request: NextRequest,
  context: any
) {
  const { params } = context as RouteContext;
  try {
    await dbConnect();
    
    const headers = request.headers;
    const userId = headers.get('x-user-id') || 'system';
    const userName = headers.get('x-user-name') || 'System User';
    const userEmail = headers.get('x-user-email') || 'system@example.com';

    // Müşteriyi bul
    const customer = await Customer.findOne({ id: params.id });
    if (!customer) {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      );
    }

    // Müşteriyi sil
    await Customer.findOneAndDelete({ id: params.id });

    // Aktivite logla
    await logActivity({
      action: 'customer_deleted',
      description: `Müşteri silindi: ${customer.firstName} ${customer.lastName}`,
      userId: decodeURIComponent(userId.replace(/_/g, '%')),
      userName: decodeURIComponent(userName.replace(/_/g, '%')),
      userEmail: decodeURIComponent(userEmail.replace(/_/g, '%')),
      targetType: 'customer',
      targetId: customer._id.toString(),
      details: {
        customerId: customer._id.toString(),
        customerName: `${customer.firstName} ${customer.lastName}`
      }
    });

    return NextResponse.json({ message: 'Müşteri başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Müşteri silinirken hata oluştu' },
      { status: 500 }
    );
  }
}

// Değişiklikleri karşılaştır
function getChanges(oldData: any, newData: any): Record<string, { old: any; new: any }> {
  const changes: Record<string, { old: any; new: any }> = {};
  
  const compareFields = [
    'firstName', 'lastName', 'email', 'phone', 'alternativePhone',
    'customerType', 'status', 'priority', 'leadSource', 'notes'
  ];
  
  compareFields.forEach(field => {
    if (oldData[field] !== newData[field]) {
      changes[field] = {
        old: oldData[field],
        new: newData[field]
      };
    }
  });
  
  // Address değişikliklerini kontrol et
  if (oldData.address && newData.address) {
    const addressFields = ['street', 'district', 'city', 'state', 'country', 'postalCode'];
    addressFields.forEach(field => {
      if (oldData.address[field] !== newData.address[field]) {
        changes[`address.${field}`] = {
          old: oldData.address[field],
          new: newData.address[field]
        };
      }
    });
  }
  
  // Assigned agent değişikliklerini kontrol et
  if (oldData.assignedAgent?.agentId !== newData.assignedAgent?.agentId) {
    changes['assignedAgent'] = {
      old: oldData.assignedAgent?.agentName || 'Atanmamış',
      new: newData.assignedAgent?.agentName || 'Atanmamış'
    };
  }
  
  return changes;
}
