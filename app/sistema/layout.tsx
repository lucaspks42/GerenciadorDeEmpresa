import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "@/components/context/SearchContext";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SearchProvider>
          <div className="flex min-h-screen bg-background">
            <Sidebar />

            <main className="flex-1 min-w-0 bg-background">
              <Header />

              {children}
            </main>
          </div>
        </SearchProvider>
      </body>
    </html>
  );
}
