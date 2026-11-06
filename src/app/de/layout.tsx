export default function GermanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Standalone German pages (not a full site locale): server-rendered
  // language boundary, mirrored by the root lang script and Content-Language.
  return (
    <div lang="de" className="contents">
      {children}
    </div>
  );
}
