import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { X, Upload } from 'lucide-react';

interface Category {
  _id: string;
  name?: string;
  displayName?: string;
}

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  mainImageUrl: string;
  additionalImages: string[];
}

interface AdminProductFormProps {
  productId?: string;
  productName?: string;
  onProductCreated: () => void;
}

export default function AdminProductForm({ productId, productName, onProductCreated }: AdminProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    categoryId: '',
    mainImageUrl: '',
    additionalImages: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { items } = await BaseCrudService.getAll('StoreCatalog/Categories');
        setCategories(items as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch product data if editing
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const product = await BaseCrudService.getById('StoreCatalog/Products', productId);
          
          setFormData({
            name: product.name || '',
            price: product.price || 0,
            description: product.description || '',
            categoryId: product.categoryId || '',
            mainImageUrl: product.media?.mainMedia?.image?.url || '',
            additionalImages: product.media?.items?.map((item: any) => item.image?.url).filter(Boolean) || [],
          });

          if (product.media?.mainMedia?.image?.url) {
            setImagePreview(product.media.mainMedia.image.url);
          }

          if (product.media?.items) {
            setAdditionalImagePreviews(
              product.media.items.map((item: any) => item.image?.url).filter(Boolean)
            );
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('Failed to load product');
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setImagePreview(url);
        setFormData(prev => ({ ...prev, mainImageUrl: url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setAdditionalImagePreviews(prev => [...prev, url]);
        setFormData(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, url],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price || !formData.categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);

      const productData = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        categoryId: formData.categoryId,
        media: {
          mainMedia: {
            image: {
              url: formData.mainImageUrl,
            },
          },
          items: formData.additionalImages.map(url => ({
            image: { url },
          })),
        },
      };

      if (productId) {
        // Update existing product
        await BaseCrudService.update('StoreCatalog/Products', {
          _id: productId,
          ...productData,
        });
      } else {
        // Create new product
        await BaseCrudService.create('StoreCatalog/Products', {
          _id: crypto.randomUUID(),
          ...productData,
        });
      }

      onProductCreated();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/20 border border-destructive rounded-lg p-4">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Name */}
          <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
            <label className="block text-primary-foreground font-medium mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full bg-background border border-primary-foreground/20 rounded px-4 py-2 text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
              required
            />
          </div>

          {/* Price */}
          <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
            <label className="block text-primary-foreground font-medium mb-2">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-background border border-primary-foreground/20 rounded px-4 py-2 text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50"
              required
            />
          </div>

          {/* Category */}
          <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
            <label className="block text-primary-foreground font-medium mb-2">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full bg-background border border-primary-foreground/20 rounded px-4 py-2 text-primary-foreground focus:outline-none focus:border-primary-foreground/50"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.displayName || cat.name || cat._id}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
            <label className="block text-primary-foreground font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={5}
              className="w-full bg-background border border-primary-foreground/20 rounded px-4 py-2 text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50 resize-none"
            />
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
            <label className="block text-primary-foreground font-medium mb-4">Main Image</label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Main product image"
                    width={200}
                    height={200}
                    className="w-full h-auto rounded object-cover"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-primary-foreground/20 rounded cursor-pointer hover:border-primary-foreground/50 transition-colors">
                <Upload size={18} className="text-primary-foreground" />
                <span className="text-primary-foreground text-sm">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Additional Images */}
          <div className="bg-primary border border-primary-foreground/10 rounded-lg p-6">
            <label className="block text-primary-foreground font-medium mb-4">Additional Images</label>
            <div className="space-y-4">
              {additionalImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Additional image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-24 rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-1 right-1 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} className="text-primary-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-primary-foreground/20 rounded cursor-pointer hover:border-primary-foreground/50 transition-colors">
                <Upload size={18} className="text-primary-foreground" />
                <span className="text-primary-foreground text-sm">Add Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3 bg-primary-foreground text-background rounded font-medium hover:bg-primary-foreground/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
