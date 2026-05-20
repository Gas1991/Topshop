import { api } from '@/lib/woocommerce';
import HomePage from '@/components/HomePage';

export const dynamic = 'force-dynamic'; // render at request time, not build time
export const revalidate = 60;           // cache 60s on Netlify

export default async function Page() {
  const [newProducts, deals, categories] = await Promise.all([
    api.products.latest(6).catch(() => []),
    api.products.onSale(6).catch(() => []),
    api.categories.top(8).catch(() => []),
  ]);

  return (
    <HomePage
      newProducts={newProducts}
      deals={deals}
      categories={categories}
    />
  );
}
