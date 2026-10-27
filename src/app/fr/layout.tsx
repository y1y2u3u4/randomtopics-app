export default function FrenchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Standalone French pages (not a full site locale): server-rendered
  // language boundary, mirrored by the root lang script and Content-Language.
  return (
    <div lang="fr" className="contents">
      {children}
    </div>
  );
}
