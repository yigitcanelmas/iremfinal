import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { generateSlug } from '@/utils/slug';
import { logActivity } from '@/lib/server-activity-logger';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // URL'den query parametrelerini al
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minSize = searchParams.get('minSize');
    const maxSize = searchParams.get('maxSize');
    const rooms = searchParams.get('rooms');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Filtreleme koşullarını oluştur
    const query: any = {};

    if (type) query.type = type;
    if (city) query['location.city'] = city;
    if (district) query['location.district'] = district;
    if (minPrice) query.price = { $gte: parseInt(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice) };
    if (minSize) query['specs.size'] = { $gte: parseInt(minSize) };
    if (maxSize) query['specs.size'] = { ...query['specs.size'], $lte: parseInt(maxSize) };
    if (rooms) query['specs.rooms'] = rooms;

    // Toplam sayfa sayısını hesapla
    const total = await Property.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Emlakları getir
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      properties,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error('Properties API Error:', error);
    return NextResponse.json(
      { error: 'Emlaklar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // ID oluştur
    body.id = `IW${Date.now()}${Math.random().toString(36).substr(2, 3)}`;
    
    // Slug oluştur
    body.slug = generateSlug(body.title, body.type);
    
    // Map admin form data to new schema structure
    const propertyData = {
      id: body.id,
      type: body.type,
      category: {
        main: body.category?.main || 'Konut',
        sub: body.category?.sub || body.category || 'Apartman Dairesi'
      },
      title: body.title,
      slug: body.slug,
      description: body.description,
      price: body.price,
      location: {
        country: body.location?.country || 'TR',
        state: body.location?.state,
        city: body.location?.city,
        district: body.location?.district,
        neighborhood: body.location?.neighborhood,
        address: body.location?.address,
        coordinates: body.location?.coordinates
      },
      specs: {
        netSize: body.specs?.size || body.specs?.netSize,
        grossSize: body.specs?.grossSize,
        rooms: body.specs?.rooms,
        bathrooms: body.specs?.bathrooms,
        age: body.specs?.age,
        floor: body.buildingFeatures?.floor || body.specs?.floor,
        totalFloors: body.buildingFeatures?.totalFloors || body.specs?.totalFloors,
        heating: body.propertyDetails?.heatingType || body.specs?.heating,
        furnishing: body.specs?.furnishing,
        balconyCount: body.specs?.balconyCount
      },
      interiorFeatures: {
        kitchenType: body.propertyDetails?.kitchenType || body.interiorFeatures?.kitchenType,
        hasBuiltInKitchen: body.interiorFeatures?.hasBuiltInKitchen || false,
        hasBuiltInWardrobe: body.interiorFeatures?.hasBuiltInWardrobe || false,
        hasLaminate: body.interiorFeatures?.hasLaminate || false,
        hasParquet: body.interiorFeatures?.hasParquet || false,
        hasCeramic: body.interiorFeatures?.hasCeramic || false,
        hasMarble: body.interiorFeatures?.hasMarble || false,
        hasWallpaper: body.interiorFeatures?.hasWallpaper || false,
        hasPaintedWalls: body.interiorFeatures?.hasPaintedWalls || false,
        hasSpotLighting: body.interiorFeatures?.hasSpotLighting || false,
        hasHiltonBathroom: body.interiorFeatures?.hasHiltonBathroom || false,
        hasJacuzzi: body.interiorFeatures?.hasJacuzzi || false,
        hasShowerCabin: body.interiorFeatures?.hasShowerCabin || false,
        hasAmericanDoor: body.interiorFeatures?.hasAmericanDoor || false,
        hasSteelDoor: body.interiorFeatures?.hasSteelDoor || false,
        hasIntercom: body.interiorFeatures?.hasIntercom || false
      },
      exteriorFeatures: {
        hasBalcony: body.propertyDetails?.hasBalcony || body.exteriorFeatures?.hasBalcony || false,
        hasTerrace: body.exteriorFeatures?.hasTerrace || false,
        hasGarden: body.exteriorFeatures?.hasGarden || false,
        hasGardenUse: body.exteriorFeatures?.hasGardenUse || false,
        hasSeaView: body.exteriorFeatures?.hasSeaView || false,
        hasCityView: body.exteriorFeatures?.hasCityView || false,
        hasNatureView: body.exteriorFeatures?.hasNatureView || false,
        hasPoolView: body.exteriorFeatures?.hasPoolView || false,
        facade: body.exteriorFeatures?.facade
      },
      buildingFeatures: {
        hasElevator: body.buildingFeatures?.hasElevator || false,
        hasCarPark: body.buildingFeatures?.hasParking || body.buildingFeatures?.hasCarPark || false,
        hasClosedCarPark: body.buildingFeatures?.hasClosedCarPark || false,
        hasOpenCarPark: body.buildingFeatures?.hasOpenCarPark || false,
        hasSecurity: body.buildingFeatures?.hasSecurity || false,
        has24HourSecurity: body.buildingFeatures?.has24HourSecurity || false,
        hasCameraSystem: body.buildingFeatures?.hasCameraSystem || false,
        hasConcierge: body.buildingFeatures?.hasConcierge || false,
        hasPool: body.buildingFeatures?.hasPool || false,
        hasGym: body.buildingFeatures?.hasGym || false,
        hasSauna: body.buildingFeatures?.hasSauna || false,
        hasTurkishBath: body.buildingFeatures?.hasTurkishBath || false,
        hasPlayground: body.buildingFeatures?.hasPlayground || false,
        hasBasketballCourt: body.buildingFeatures?.hasBasketballCourt || false,
        hasTennisCourt: body.buildingFeatures?.hasTennisCourt || false,
        hasGenerator: body.buildingFeatures?.hasGenerator || false,
        hasFireEscape: body.buildingFeatures?.hasFireEscape || false,
        hasFireDetector: body.buildingFeatures?.hasFireDetector || false,
        hasWaterBooster: body.buildingFeatures?.hasWaterBooster || false,
        hasSatelliteSystem: body.buildingFeatures?.hasSatelliteSystem || false,
        hasWifi: body.buildingFeatures?.hasWifi || false
      },
      propertyDetails: {
        usageStatus: body.propertyDetails?.usageStatus,
        deedStatus: body.propertyDetails?.deedStatus,
        fromWho: body.propertyDetails?.fromWho,
        isSettlement: body.propertyDetails?.isSettlement || false,
        creditEligible: body.propertyDetails?.creditEligible || false,
        exchangeAvailable: body.propertyDetails?.exchangeAvailable || false,
        inSite: body.propertyDetails?.inSite || false,
        monthlyFee: body.propertyDetails?.monthlyFee,
        hasDebt: body.propertyDetails?.hasDebt || false,
        debtAmount: body.propertyDetails?.debtAmount,
        isRentGuaranteed: body.propertyDetails?.isRentGuaranteed || false,
        rentGuaranteeAmount: body.propertyDetails?.rentGuaranteeAmount,
        isNewBuilding: body.propertyDetails?.isNewBuilding || false,
        isSuitableForOffice: body.propertyDetails?.isSuitableForOffice || false,
        hasBusinessLicense: body.propertyDetails?.hasBusinessLicense || false
      },
      images: body.images || [],
      virtualTour: body.virtualTour,
      panoramicImages: body.panoramicImages || [],
      viewCount: 0,
      isFeatured: body.isFeatured || false,
      isSponsored: body.isSponsored || false,
      status: body.status || 'active',
      agent: {
        id: body.agent?.id,
        name: body.agent?.name,
        phone: body.agent?.phone,
        email: body.agent?.email,
        photo: body.agent?.photo,
        company: body.agent?.company,
        isOwner: body.agent?.isOwner || false
      },
      sahibindenLink: body.sahibindenLink,
      hurriyetEmlakLink: body.hurriyetEmlakLink,
      emlakJetLink: body.emlakJetLink,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const createdProperty = await Property.create(propertyData);

    // Aktiviteyi logla
    await logActivity({
      userId: request.headers.get('x-user-id') || 'system',
      userName: request.headers.get('x-user-name') || 'System',
      userEmail: request.headers.get('x-user-email') || undefined,
      action: 'property_create',
      description: `${createdProperty.title} başlıklı yeni emlak eklendi`,
      targetType: 'property',
      targetId: createdProperty.id,
      status: 'success',
      details: {
        propertyType: createdProperty.type,
        category: createdProperty.category,
        location: {
          city: createdProperty.location.city,
          district: createdProperty.location.district
        },
        price: createdProperty.price,
        specs: createdProperty.specs,
        imageCount: createdProperty.images?.length || 0
      },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    });
    
    return NextResponse.json(createdProperty, { status: 201 });
  } catch (error) {
    console.error('Property Creation Error:', error);
    return NextResponse.json(
      { error: 'Emlak eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
