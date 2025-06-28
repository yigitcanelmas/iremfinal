import PropertyDetailPage from "@/components/ui/PropertyDetailPage";

export default function RentPropertyPage({ params }: { params: { slug: string } }) {
  return <PropertyDetailPage slug={params.slug} type="rent" />;
}
