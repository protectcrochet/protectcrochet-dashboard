// app/dashboard/layout.tsx
export const metadata = {
  title: 'ProtectCrochet — Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ minHeight: '100dvh', padding: 24, background: '#0a0a0a', color: '#e5e7eb' }}>
      {/* Layout mínimo temporal, sin auth ni sidebar para desbloquear /dashboard */}
      {children}
    </section>
  );
}


