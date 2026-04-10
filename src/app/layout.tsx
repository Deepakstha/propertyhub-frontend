import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'PropertyHub - Real Estate Listings',
  description:
    'Search and explore real estate listings across Sydney suburbs. Find houses, apartments, townhouses and land.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-72px)]">{children}</main>
       
      </body>
    </html>
  );
}
