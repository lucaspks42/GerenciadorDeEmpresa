import { SearchProvider } from "@/components/context/SearchContext";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";

export default async function SistemaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessao = await obterSessao();

  if (!sessao) {
    redirect("/login");
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 min-w-0 bg-background">
          <Header />

          {children}
        </main>
      </div>
    </SearchProvider>
  );
}
