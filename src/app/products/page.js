import { Suspense } from "react";
import ProductsContent from "@/components/ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
