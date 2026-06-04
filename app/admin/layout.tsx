export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050807] text-foreground antialiased">
      {children}
    </div>
  );
}
