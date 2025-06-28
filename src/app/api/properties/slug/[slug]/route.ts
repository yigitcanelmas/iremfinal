import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

// @ts-ignore
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parametresi gerekli' },
        { status: 400 }
      );
    }

    // Slug ile property'yi bul
    const property = await Property.findOne({ slug });

    if (!property) {
      return NextResponse.json(
        { error: 'Emlak bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });

  } catch (error) {
    console.error('Property Slug API Error:', error);
    return NextResponse.json(
      { error: 'Emlak yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
