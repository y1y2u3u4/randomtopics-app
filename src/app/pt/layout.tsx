export default function PortugueseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Standalone Brazilian Portuguese pages (not a full site locale): server-
  // rendered language boundary, mirrored by the root lang script and
  // Content-Language.
  return (
    <div lang="pt" className="contents">
      {children}
    </div>
  );
}
