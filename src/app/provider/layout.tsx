import { ProviderHeader } from "@/components/provider-header";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <ProviderHeader />
      {children}
    </div>
  );
}
