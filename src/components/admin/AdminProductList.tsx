import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { Trash2, Edit2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price?: number;
  description?: string;
  media?: {
    mainMedia?: {
      image?: {
        url?: string;
      };
    };
  };
}

interface AdminProductListProps {
  onEditProduct: (productId: string, productName: string) => void;
  refreshTrigger: number;
}

export default function AdminProductList({ onEditProduct, refreshTrigger }: AdminProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { items } = await BaseCrudService.getAll('StoreCatalog/Products');
        setProducts(items as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [refreshTrigger]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeletingId(productId);
      await BaseCrudService.delete('StoreCatalog/Products', productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background border border-primary-foreground/20 rounded px-4 py-2 text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
        />
      </div>

      {/* Products Table */}
      <div className="bg-primary border border-primary-foreground/10 rounded-lg overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-primary-foreground/70">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-primary-foreground/10 bg-primary-foreground/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary-foreground">Description</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-primary-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-primary-foreground/10 hover:bg-primary-foreground/5 transition-colors">
                    <td className="px-6 py-4">
                      {product.media?.mainMedia?.image?.url ? (
                        <Image
                          src={product.media.mainMedia.image.url}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-[60px] h-[60px] bg-primary-foreground/10 rounded flex items-center justify-center">
                          <span className="text-primary-foreground/50 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-primary-foreground font-medium">{product.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-primary-foreground/70">
                        {product.price ? `$${product.price.toFixed(2)}` : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-primary-foreground/70 text-sm truncate max-w-xs">
                        {product.description || 'No description'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => onEditProduct(product._id, product.name)}
                          className="p-2 hover:bg-primary-foreground/10 rounded transition-colors text-primary-foreground"
                          title="Edit product"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="p-2 hover:bg-destructive/20 rounded transition-colors text-destructive disabled:opacity-50"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="text-primary-foreground/70 text-sm">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
