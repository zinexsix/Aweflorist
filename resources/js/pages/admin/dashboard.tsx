import AdminPage from '@/components/admin/admin-page';
import { dashboard as adminDashboard } from '@/routes/admin';

export default function Dashboard() {
    return (
        <AdminPage
            title="Dashboard"
            description="Ringkasan akan tersedia di US-23."
            breadcrumbs={[{ title: 'Dashboard', href: adminDashboard() }]}
        >
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Ringkasan akan tersedia di US-23.
            </div>
        </AdminPage>
    );
}
