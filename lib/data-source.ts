/**
 * Data source que funciona com JSON local quando não há banco disponível.
 * Isso garante que todos os 1015 produtos apareçam sem precisar de PostgreSQL.
 */
import fs from 'fs';
import path from 'path';

interface BackupCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  imageUrl?: string;
  order: number;
}

interface BackupProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount: number;
  imageUrl: string;
  inStock?: boolean;
  isOffer?: boolean;
  salesCount?: number;
  categoryId: string;
  categorySlug?: string;
  categoryName?: string;
  displayOrder?: number;
}

interface BackupData {
  categories: BackupCategory[];
  products: BackupProduct[];
}

let _cache: BackupData | null = null;

function loadBackup(): BackupData {
  if (_cache) return _cache;
  
  const backupPath = path.join(process.cwd(), 'data', 'site-data.json');
  if (!fs.existsSync(backupPath)) {
    return { categories: [], products: [] };
  }
  
  const raw = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  _cache = {
    categories: raw.categories || [],
    products: raw.products || [],
  };
  return _cache;
}

// Retorna categorias com seus produtos para a home page
export function getHomeData() {
  const { categories, products } = loadBackup();
  
  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    order: cat.order,
    products: products
      .filter(p => p.categoryId === cat.id && p.inStock !== false)
      .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
      .slice(0, 12)
      .map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discount: p.discount || 0,
        imageUrl: p.imageUrl || '',
        salesCount: p.salesCount || 0,
      })),
  })).filter(cat => cat.products.length > 0);
}

// Retorna produtos por categoria
export function getProductsByCategory(categorySlug: string) {
  const { categories, products } = loadBackup();
  const cat = categories.find(c => c.slug === categorySlug);
  if (!cat) return [];
  
  return products
    .filter(p => p.categoryId === cat.id && p.inStock !== false)
    .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
    .map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      discount: p.discount || 0,
      imageUrl: p.imageUrl || '',
      category: { name: cat.name, slug: cat.slug },
    }));
}

// Busca por nome
export function searchProducts(query: string) {
  const { categories, products } = loadBackup();
  const q = query.toLowerCase();
  
  return products
    .filter(p =>
      p.inStock !== false &&
      (p.name.toLowerCase().includes(q) ||
       (p.description ?? '').toLowerCase().includes(q) ||
       (p.categorySlug ?? '').toLowerCase().includes(q) ||
       (p.categoryName ?? '').toLowerCase().includes(q))
    )
    .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
    .map(p => {
      const cat = categories.find(c => c.id === p.categoryId);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discount: p.discount || 0,
        imageUrl: p.imageUrl || '',
        category: cat ? { name: cat.name, slug: cat.slug } : null,
      };
    });
}

// Produto por slug ou id
export function getProductBySlugOrId(slugOrId: string) {
  const { categories, products } = loadBackup();
  const p = products.find(p => p.slug === slugOrId || p.id === slugOrId);
  if (!p) return null;
  const cat = categories.find(c => c.id === p.categoryId);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    price: p.price,
    discount: p.discount || 0,
    imageUrl: p.imageUrl || '',
    category: cat ? { name: cat.name, slug: cat.slug } : null,
  };
}
