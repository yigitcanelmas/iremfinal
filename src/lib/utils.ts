import fs from 'fs';
import path from 'path';
import { Property } from '@/types/property';

function optimizeProperty(property: any): any {
  return {
    id: property.id.toString(),
    type: property.type,
    title: property.title,
    description: property.description.substring(0, 200), // Açıklamayı kısalt
    price: property.price,
    location: {
      country: 'TR',
      city: property.location.city,
      district: property.location.district,
      coordinates: property.location.coordinates
    },
    specs: {
      size: property.specs.size,
      rooms: property.specs.rooms,
      bathrooms: property.specs.bathrooms,
      age: property.specs.age,
      furnishing: property.specs.furnishing
    },
    features: property.features ? property.features.slice(0, 5) : [], // Maksimum 5 özellik
    buildingFeatures: {
      hasParking: property.buildingFeatures?.hasParking || false,
      hasElevator: property.buildingFeatures?.hasElevator || false,
      hasSecurity: property.buildingFeatures?.hasSecurity || false,
      hasPool: property.buildingFeatures?.hasPool || false,
      hasGym: property.buildingFeatures?.hasGym || false
    },
    propertyDetails: {
      heatingType: property.specs?.heatingType || property.propertyDetails?.heatingType,
      hasBalcony: property.features?.includes('Balkon') || false,
      inSite: property.buildingFeatures?.hasSecurity || false
    },
    images: property.images ? property.images.slice(0, 20) : [], // Maksimum 20 resim
    agent: property.agent,
    createdAt: property.createdAt || new Date()
  };
}

export function readSaleProperties(): Property[] {
  const filePath = path.join(process.cwd(), 'src', 'data', 'sale.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const properties = JSON.parse(fileContent);
  return properties.map(optimizeProperty);
}

export function readRentProperties(): Property[] {
  const filePath = path.join(process.cwd(), 'src', 'data', 'rent.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const properties = JSON.parse(fileContent);
  return properties.map(optimizeProperty);
}
 