import AdminDashboard from './admin-dashboard';

export const metadata = {
  title: 'Admin | Zé Pedidos',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
