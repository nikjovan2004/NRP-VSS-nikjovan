import { CustomerHeader } from "@/components/customer-header";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <CustomerHeader />
      {children}
    </div>
  );
}
