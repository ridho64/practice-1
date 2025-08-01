import { getDb } from "@/lib/mongodb";

export async function GET(request, context) {
  const params = await context.params; // 👈 await params
  const slug = params.slug;

  const db = await getDb();

  if (!slug) {
    return new Response("Slug is required", { status: 400 });
  }

  const product = await db.collection("products").findOne({ slug });

  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  return Response.json(product);
}
