import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CustomerInteraction from '@/models/CustomerInteraction';
import Customer from '@/models/Customer';
import { logActivity } from '@/lib/server-activity-logger';
import { CreateInteractionData } from '@/types/customer';

// @ts-ignore
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    const filters: any = { customerId: params.id };
    
    if (searchParams.get('interactionType')) {
      filters.interactionType = searchParams.get('interactionType');
    }
    
    if (searchParams.get('outcome')) {
      filters.outcome = searchParams.get('outcome');
    }
    
    if (searchParams.get('followUpRequired')) {
      filters.followUpRequired = searchParams.get('followUpRequired') === 'true';
    }
    
    if (searchParams.get('dateFrom') || searchParams.get('dateTo')) {
      const dateFilter: any = {};
      if (searchParams.get('dateFrom')) {
        dateFilter.$gte = new Date(searchParams.get('dateFrom')!);
      }
      if (searchParams.get('dateTo')) {
        dateFilter.$lte = new Date(searchParams.get('dateTo')!);
      }
      filters.interactionDate = dateFilter;
    }
    
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      filters.$or = [
        { subject: new RegExp(searchTerm, 'i') },
        { description: new RegExp(searchTerm, 'i') },
        { followUpNotes: new RegExp(searchTerm, 'i') }
      ];
    }
    
    if (searchParams.get('type') === 'stats') {
      const stats = await CustomerInteraction.aggregate([
        { $match: { customerId: params.id } },
        {
          $facet: {
            totalInteractions: [{ $count: "count" }],
            byType: [
              { $group: { _id: '$interactionType', count: { $sum: 1 } } }
            ],
            byOutcome: [
              { $group: { _id: '$outcome', count: { $sum: 1 } } }
            ],
            averageDuration: [
              { $match: { duration: { $exists: true, $ne: null } } },
              { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
            ],
            followUpsPending: [
              { 
                $match: { 
                  followUpRequired: true,
                  followUpDate: { $gte: new Date() }
                }
              },
              { $count: "count" }
            ],
            recentInteractions: [
              { $sort: { interactionDate: -1 } },
              { $limit: 5 },
              {
                $project: {
                  interactionType: 1,
                  subject: 1,
                  interactionDate: 1,
                  outcome: 1
                }
              }
            ]
          }
        }
      ]);
      
      const result = stats[0];
      
      return NextResponse.json({
        totalInteractions: result.totalInteractions[0]?.count || 0,
        averageDuration: result.averageDuration[0]?.avgDuration || 0,
        followUpsPending: result.followUpsPending[0]?.count || 0,
        byType: result.byType.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byOutcome: result.byOutcome.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentInteractions: result.recentInteractions
      });
    }
    
    const total = await CustomerInteraction.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);
    
    const interactions = await CustomerInteraction.find(filters)
      .sort({ interactionDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      interactions,
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
    console.error('Customer Interactions API Error:', error);
    return NextResponse.json(
      { error: 'Müşteri etkileşimleri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// @ts-ignore
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    await dbConnect();
    
    const body: CreateInteractionData = await request.json();
    
    const customer = await Customer.findOne({ id: params.id });
    if (!customer) {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      );
    }
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 5);
    const interactionId = `INT${timestamp}${random}`;
    
    const userId = request.headers.get('x-user-id') || 'system';
    const userName = request.headers.get('x-user-name') || 'System';
    const userEmail = request.headers.get('x-user-email') || undefined;
    
    const interactionData = {
      id: interactionId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      agentId: userId,
      agentName: userName,
      ...body,
      customerId: params.id,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    };
    
    const interaction = await CustomerInteraction.create(interactionData);
    
    await Customer.findOneAndUpdate(
      { id: params.id },
      {
        $set: {
          'communicationSummary.lastContactDate': new Date(),
          'communicationSummary.lastInteractionType': body.interactionType,
          'communicationSummary.nextFollowUpDate': body.followUpDate ? new Date(body.followUpDate) : undefined
        },
        $inc: {
          'communicationSummary.totalInteractions': 1
        }
      }
    );
    
    await logActivity({
      userId,
      userName,
      userEmail,
      action: 'customer_interaction_create',
      description: `${customer.firstName} ${customer.lastName} müşterisi ile ${body.interactionType} türünde etkileşim kaydedildi`,
      targetType: 'customer',
      targetId: customer.id,
      status: 'success',
      details: {
        interactionType: body.interactionType,
        subject: body.subject,
        outcome: body.outcome,
        followUpRequired: body.followUpRequired,
        relatedProperty: body.relatedProperty?.propertyTitle
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });
    
    return NextResponse.json(interaction, { status: 201 });
    
  } catch (error: any) {
    console.error('Customer Interaction Creation Error:', error);
    return NextResponse.json(
      { error: 'Etkileşim oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}
