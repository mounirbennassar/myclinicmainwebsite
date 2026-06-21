// Dental section uses the root LangProvider via app/layout.tsx — this layout
// only adds dental-specific page chrome wrappers.

export default function DentalLayout({ children }: { children: React.ReactNode }) {
  return <div className="font-body antialiased">{children}</div>;
}
