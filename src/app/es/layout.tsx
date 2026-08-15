export default function SpanishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // This gives every Spanish route a server-rendered language boundary,
  // including utility pages that do not render their own <main lang="es">.
  return (
    <div lang="es" className="contents">
      {children}
    </div>
  );
}
