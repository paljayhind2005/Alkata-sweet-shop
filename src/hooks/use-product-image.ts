/**
 * useProductImage Hook
 * Provides product image URL with fallback to authentic Indian sweet images
 */

import { useEffect, useState } from 'react';
import { getProductImageUrl } from '@/lib/product-images';
import { productsV3 } from '@wix/stores';

export function useProductImage(product?: productsV3.V3Product): {
  imageUrl: string;
  fallbackImageUrl: string;
  hasImage: boolean;
} {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [fallbackImageUrl, setFallbackImageUrl] = useState<string>('');

  useEffect(() => {
    if (product?.name) {
      const fallback = getProductImageUrl(product.name);
      setFallbackImageUrl(fallback);

      // Check if product has media - Wix Stores v3 uses mainMedia or items array
      const mainMediaUrl = (product.media as any)?.mainMedia?.image?.url;
      const firstItemUrl = (product.media as any)?.items?.[0]?.image?.url;
      const hasMedia = mainMediaUrl || firstItemUrl;
      
      if (hasMedia) {
        setImageUrl(hasMedia);
      } else {
        // Use fallback if no image
        setImageUrl(fallback);
      }
    }
  }, [product?.name, product?.media]);

  return {
    imageUrl,
    fallbackImageUrl,
    hasImage: !!imageUrl,
  };
}
