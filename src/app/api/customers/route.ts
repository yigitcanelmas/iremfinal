import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { logActivity } from '@/lib/server-activity-logger';
import { CreateCustomerData, CustomerFilters } from '@/types/customer';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Filtreleme parametreleri
    const filters: any = {};
    
    if (searchParams.get('customerType')) {
      filters.customerType = searchParams.get('customerType');
    }
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status');
    }
    
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority');
    }
    
    if (searchParams.get('leadSource')) {
      filters.leadSource = searchParams.get('leadSource');
    }
    
    if (searchParams.get('assignedAgent')) {
      filters['assignedAgent.agentId'] = searchParams.get('assignedAgent');
    }
    
    if (searchParams.get('city')) {
      filters['address.city'] = new RegExp(searchParams.get('city')!, 'i');
    }
    
    if (searchParams.get('district')) {
      filters['address.district'] = new RegExp(searchParams.get('district')!, 'i');
    }
    
    // Bütçe filtreleri
    if (searchParams.get('budgetMin') || searchParams.get('budgetMax')) {
      const budgetFilter: any = {};
      if (searchParams.get('budgetMin')) {
        budgetFilter.$gte = parseInt(searchParams.get('budgetMin')!);
      }
      if (searchParams.get('budgetMax')) {
        budgetFilter.$lte = parseInt(searchParams.get('budgetMax')!);
      }
      filters['propertyPreferences.budgetMax'] = budgetFilter;
    }
    
    // Emlak tipi filtresi
    if (searchParams.get('propertyType')) {
      const propertyType = searchParams.get('propertyType');
      if (propertyType !== 'both') {
        filters['propertyPreferences.type'] = { $in: [propertyType, 'both'] };
      }
    }
    
    // Etiket filtresi
    if (searchParams.get('tags')) {
      const tags = searchParams.get('tags')!.split(',');
      filters.tags = { $in: tags };
    }
    
    // Tarih filtresi
    if (searchParams.get('dateFrom') || searchParams.get('dateTo')) {
      const dateFilter: any = {};
      if (searchParams.get('dateFrom')) {
        dateFilter.$gte = new Date(searchParams.get('dateFrom')!);
      }
      if (searchParams.get('dateTo')) {
        dateFilter.$lte = new Date(searchParams.get('dateTo')!);
      }
      filters.createdAt = dateFilter;
    }
    
    // Arama filtresi
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      filters.$or = [
        { firstName: new RegExp(searchTerm, 'i') },
        { lastName: new RegExp(searchTerm, 'i') },
        { email: new RegExp(searchTerm, 'i') },
        { phone: new RegExp(searchTerm, 'i') },
        { notes: new RegExp(searchTerm, 'i') }
      ];
    }
    
    // İstatistik isteği kontrolü
    if (searchParams.get('type') === 'stats') {
      const stats = await Customer.aggregate([
        {
          $facet: {
            totalCustomers: [{ $count: "count" }],
            byType: [
              { $group: { _id: '$customerType', count: { $sum: 1 } } }
            ],
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } }
            ],
            bySource: [
              { $group: { _id: '$leadSource', count: { $sum: 1 } } }
            ],
            byPriority: [
              { $group: { _id: '$priority', count: { $sum: 1 } } }
            ],
            byAgent: [
              { 
                $match: { 'assignedAgent.agentId': { $exists: true } }
              },
              { 
                $group: { 
                  _id: '$assignedAgent.agentId',
                  agentName: { $first: '$assignedAgent.agentName' },
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],
            newLeads: [
              {
                $match: {
                  customerType: 'lead',
                  createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                }
              },
              { $count: "count" }
            ],
            activeClients: [
              {
                $match: {
                  customerType: { $in: ['active_client', 'prospect'] },
                  status: 'active'
                }
              },
              { $count: "count" }
            ]
          }
        }
      ]);
      
      const result = stats[0];
      
      return NextResponse.json({
        totalCustomers: result.totalCustomers[0]?.count || 0,
        newLeads: result.newLeads[0]?.count || 0,
        activeClients: result.activeClients[0]?.count || 0,
        byType: result.byType.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byStatus: result.byStatus.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bySource: result.bySource.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byPriority: result.byPriority.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byAgent: result.byAgent.map((item: any) => ({
          agentId: item._id,
          agentName: item.agentName,
          customerCount: item.count
        }))
      });
    }
    
    // Normal müşteri listesi
    const total = await Customer.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);
    
    const customers = await Customer.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Customers API Error:', error);
    return NextResponse.json(
      { error: 'Müşteriler yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body: CreateCustomerData = await request.json();
    
    // Müşteri ID'si oluştur
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 5);
    const customerId = `CUS${timestamp}${random}`;
    
    // Kullanıcı bilgilerini header'dan al
    const userId = request.headers.get('x-user-id') || 'system';
    const userName = request.headers.get('x-user-name') || 'System';
    const userEmail = request.headers.get('x-user-email') || undefined;
    
    // Müşteri verilerini hazırla
    const customerData = {
      id: customerId,
      ...body,
      createdBy: {
        userId,
        userName
      },
      communicationSummary: {
        totalInteractions: 0
      },
      interestedProperties: [],
      tags: body.tags || []
    };
    
    // Müşteriyi oluştur
    const customer = await Customer.create(customerData);
    
    // Aktiviteyi logla
    await logActivity({
      userId,
      userName,
      userEmail,
      action: 'customer_create',
      description: `${customer.firstName} ${customer.lastName} adlı yeni müşteri eklendi`,
      targetType: 'customer',
      targetId: customer.id,
      status: 'success',
      details: {
        customerType: customer.customerType,
        leadSource: customer.leadSource,
        email: customer.email,
        phone: customer.phone,
        assignedAgent: customer.assignedAgent?.agentName
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });
    
    return NextResponse.json(customer, { status: 201 });
    
  } catch (error: any) {
    console.error('Customer Creation Error:', error);
    
    // Duplicate email hatası
    if (error.code === 11000 && error.keyPattern?.email) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Müşteri oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}
