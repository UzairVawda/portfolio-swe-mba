// The legacy MBA tree, awaiting deletion and its 308 redirects. It used to
// mount an mba-variant nav and footer of its own; that variant no longer
// exists, so this segment simply inherits the flat site chrome from the root
// layout like every other route. It renders no <main> — the shell has one.
export default function MbaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-section="mba" className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
