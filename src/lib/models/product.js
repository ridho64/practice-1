// lib/models/product.js

import { getDb } from "@/lib/mongodb";

export async function getProducts({ category, subcategory }) {
  const db = await getDb();
  const filter = {};

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;

  const products = await db.collection("products").find(filter).toArray();

  return products;
}
