export const metadata = { title: 'Next.js + NEAR', description: 'NEAR Protocol starter' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}