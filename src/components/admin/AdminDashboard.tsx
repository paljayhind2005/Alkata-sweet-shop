import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  recentProducts: number;
}

interface ChartData {
  name: string;
  count: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
    recentProducts: 0,
  });
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch all products
        const { items: products } = await BaseCrudService.getAll('StoreCatalog/Products');
        const { items: categories } = await BaseCrudService.getAll('StoreCatalog/Categories');

        // Calculate stats
        const totalProducts = products.length;
        const totalCategories = categories.length;
        const recentProducts = products.filter((p: any) => {
          const createdDate = new Date(p._createdDate);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return createdDate > thirtyDaysAgo;
        }).length;

        // Count products by category
        const categoryCount: Record<string, number> = {};
        products.forEach((product: any) => {
          const categoryId = product.categoryId || 'Uncategorized';
          categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
        });

        const chartData = Object.entries(categoryCount).map(([name, count]) => ({
          name: name === 'Uncategorized' ? 'Uncategorized' : name,
          count,
        }));

        setStats({
          totalProducts,
          totalCategories,
          lowStockProducts: 0, // Would need inventory data
          recentProducts,
        });

        setCategoryData(chartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Total Products</p>
          <p className="font-heading text-4xl text-primary-foreground">{stats.totalProducts}</p>
        </div>

        <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Categories</p>
          <p className="font-heading text-4xl text-primary-foreground">{stats.totalCategories}</p>
        </div>

        <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Recent (30 days)</p>
          <p className="font-heading text-4xl text-primary-foreground">{stats.recentProducts}</p>
        </div>

        <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Low Stock</p>
          <p className="font-heading text-4xl text-primary-foreground">{stats.lowStockProducts}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products by Category */}
        <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
          <h3 className="font-heading text-xl text-primary-foreground mb-6">Products by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#000000',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="count" fill="#ffffff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-primary-foreground/50 text-center py-8">No data available</p>
          )}
        </div>

        {/* Activity Chart */}
        <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
          <h3 className="font-heading text-xl text-primary-foreground mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-primary-foreground/10">
              <span className="text-primary-foreground/70">Total Products Created</span>
              <span className="font-heading text-2xl text-primary-foreground">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-primary-foreground/10">
              <span className="text-primary-foreground/70">Last 30 Days</span>
              <span className="font-heading text-2xl text-primary-foreground">{stats.recentProducts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-foreground/70">Categories</span>
              <span className="font-heading text-2xl text-primary-foreground">{stats.totalCategories}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
