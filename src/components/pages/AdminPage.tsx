import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProductList from '@/components/admin/AdminProductList';
import AdminProductForm from '@/components/admin/AdminProductForm';

type AdminView = 'dashboard' | 'products' | 'create-product' | 'edit-product';

interface EditingProduct {
  id: string;
  name: string;
}

export default function AdminPage() {
  const { member, isLoading } = useMember();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check if user is admin (has admin badge)
  const isAdmin = member?.profile?.title === 'admin' || member?.loginEmail === 'admin@example.com';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-primary-foreground mb-4">Access Denied</h1>
          <p className="text-primary-foreground/70 mb-8">You don't have permission to access the admin panel.</p>
          <a href="/" className="text-primary-foreground underline hover:no-underline">
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  const handleEditProduct = (productId: string, productName: string) => {
    setEditingProduct({ id: productId, name: productName });
    setCurrentView('edit-product');
  };

  const handleBackToProducts = () => {
    setEditingProduct(null);
    setCurrentView('products');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProductCreated = () => {
    setCurrentView('products');
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-primary border-b border-primary-foreground/10">
        <div className="max-w-[120rem] mx-auto px-6 py-6">
          <h1 className="font-heading text-4xl italic text-primary-foreground mb-2">Admin Panel</h1>
          <p className="text-primary-foreground/70">Welcome, {member?.profile?.nickname || member?.loginEmail}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-primary border-b border-primary-foreground/10 sticky top-0 z-10">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                currentView === 'dashboard'
                  ? 'border-primary-foreground text-primary-foreground'
                  : 'border-transparent text-primary-foreground/60 hover:text-primary-foreground'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('products')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                currentView === 'products' || currentView === 'edit-product'
                  ? 'border-primary-foreground text-primary-foreground'
                  : 'border-transparent text-primary-foreground/60 hover:text-primary-foreground'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setCurrentView('create-product')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                currentView === 'create-product'
                  ? 'border-primary-foreground text-primary-foreground'
                  : 'border-transparent text-primary-foreground/60 hover:text-primary-foreground'
              }`}
            >
              Create Product
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-[120rem] mx-auto px-6 py-12">
        {currentView === 'dashboard' && <AdminDashboard />}
        {currentView === 'products' && (
          <AdminProductList onEditProduct={handleEditProduct} refreshTrigger={refreshTrigger} />
        )}
        {currentView === 'create-product' && (
          <AdminProductForm onProductCreated={handleProductCreated} />
        )}
        {currentView === 'edit-product' && editingProduct && (
          <div>
            <button
              onClick={handleBackToProducts}
              className="mb-6 text-primary-foreground/70 hover:text-primary-foreground flex items-center gap-2"
            >
              ← Back to Products
            </button>
            <AdminProductForm
              productId={editingProduct.id}
              productName={editingProduct.name}
              onProductCreated={handleBackToProducts}
            />
          </div>
        )}
      </div>
    </div>
  );
}
