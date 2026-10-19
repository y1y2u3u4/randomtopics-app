export default function TurkishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Standalone Turkish pages (not a full site locale): server-rendered
  // language boundary, mirrored by the root lang script and Content-Language.
  return (
    <div lang="tr" className="contents">
      {children}
    </div>
  );
}
