export default function JapaneseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Standalone Japanese pages (not a full site locale): server-rendered
  // language boundary, mirrored by the root lang script and Content-Language.
  return (
    <div lang="ja" className="contents">
      {children}
    </div>
  );
}
