const staticImages = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop', // Laptop
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', // Phone
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', // Headphones
  'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop', // Device
  'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=800&auto=format&fit=crop', // VR/Accessories
  'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800&auto=format&fit=crop', // Gadgets
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop', // Smartwatch
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop', // AirPods
];

export const getProductImage = (product) => {
  if (product?.images && product.images.length > 0 && product.images[0] && !product.images[0].includes('placeholder')) {
    return product.images[0];
  }
  
  // Create a consistent index based on the product's ID so it doesn't change every render
  let index = 0;
  if (product?._id) {
    // Generate a simple hash from the ID string
    const hash = Array.from(product._id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    index = hash % staticImages.length;
  }
  
  return staticImages[index];
};

export const getMultipleProductImages = (product) => {
  if (product?.images && product.images.length > 1 && !product.images[0].includes('placeholder')) {
    return product.images;
  }
  
  let index = 0;
  if (product?._id) {
    const hash = Array.from(product._id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    index = hash % staticImages.length;
  }
  
  return [
    staticImages[index],
    staticImages[(index + 1) % staticImages.length],
    staticImages[(index + 2) % staticImages.length],
    staticImages[(index + 3) % staticImages.length],
  ];
};
