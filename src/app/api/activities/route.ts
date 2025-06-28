import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ActivityModel from '@/models/Activity';
import { Activity } from '@/types/activity';

// GET /api/activities - Aktiviteleri getir
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = Number(searchParams.get('limit')) || 10;

    switch (type) {
      case 'stats':
        // Son 30 günlük istatistikler
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Bugünün başlangıcı
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Bu haftanın başlangıcı (Pazartesi)
        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay() + 1);
        thisWeek.setHours(0, 0, 0, 0);

        // Bu ayın başlangıcı
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        // Tüm istatistikleri tek sorguda al
        const [stats] = await ActivityModel.aggregate([
          {
            $facet: {
              // Toplam aktivite sayısı
              'totalCount': [
                { $count: 'count' }
              ],
              // Bugünkü aktiviteler
              'todayCount': [
                { $match: { timestamp: { $gte: today } } },
                { $count: 'count' }
              ],
              // Bu haftaki aktiviteler
              'weekCount': [
                { $match: { timestamp: { $gte: thisWeek } } },
                { $count: 'count' }
              ],
              // Bu ayki aktiviteler
              'monthCount': [
                { $match: { timestamp: { $gte: thisMonth } } },
                { $count: 'count' }
              ],
              // En çok yapılan işlemler
              'topActions': [
                { $group: { _id: '$action', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $project: { action: '$_id', count: 1, _id: 0 } }
              ],
              // En aktif kullanıcılar
              'topUsers': [
                { $group: { 
                  _id: '$userId',
                  userName: { $first: '$userName' },
                  count: { $sum: 1 }
                }},
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $project: { 
                  userId: '$_id',
                  userName: 1,
                  count: 1,
                  _id: 0
                }}
              ]
            }
          }
        ]);

        // İstatistikleri düzenle
        const formattedStats = {
          totalActivities: (stats.totalCount[0]?.count || 0),
          todayActivities: (stats.todayCount[0]?.count || 0),
          weekActivities: (stats.weekCount[0]?.count || 0),
          monthActivities: (stats.monthCount[0]?.count || 0),
          topActions: stats.topActions || [],
          topUsers: stats.topUsers || []
        };

        return NextResponse.json(formattedStats);

      case 'recent':
      default:
        const activities = await ActivityModel.find()
          .sort({ timestamp: -1 })
          .limit(limit)
          .lean();

        return NextResponse.json(activities);
    }
  } catch (error) {
    console.error('Aktivite logları getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Aktivite logları getirilemedi' },
      { status: 500 }
    );
  }
}

// POST endpoint kaldırıldı - artık server-side activity logger kullanıyoruz
