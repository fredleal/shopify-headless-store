import { StoreHeader } from "@/components/organisms/StoreHeader/StoreHeader";
import { StoreFooter } from "@/components/organisms/StoreFooter/StoreFooter";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  );
}
