import { getDb } from "@/lib/mongodb";

export async function GET(request) {
  const db = await getDb();
  const url = new URL(request.url);

  const featured = url.searchParams.get("featured");
  const gender = url.searchParams.get("gender");
  const category = url.searchParams.get("category");
  const subcategory = url.searchParams.get("subcategory");

  const query = {};

  if (featured === "true") {
    query.featured = true;
  }

  if (gender) {
    query.genders = { $in: [gender, "unisex"] }; 
    // Match products where genders array includes 'gender' or 'unisex'
  }

  if (category) {
    query.category = category;
  }

  if (subcategory) {
    query.subcategory = subcategory;
  }

  const products = await db.collection("products").find(query).toArray();
  return Response.json(products);
}
