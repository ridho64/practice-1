import { use } from "react";
import ProductDetail from "@/components/ProductDetail"; // Adjust path if needed!

export default function ProductPage(props) {
  const params = use(props.params);  // ✅ unwrap Promise params safely
  return (
    <ProductDetail slug={params.slug} />
  );
}
