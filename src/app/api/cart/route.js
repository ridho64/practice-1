import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const getUserIdFromRequest = async (req) => {
  const cookie = req.headers.get("cookie");
  const token = cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};

export async function GET(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const cartItems = await db
    .collection("cart")
    .find({ userId: new ObjectId(userId) })
    .toArray();

  // Fetch full product data
  const productIds = cartItems.map((item) => new ObjectId(item.productId));
  const products = await db
    .collection("products")
    .find({ _id: { $in: productIds } })
    .toArray();

  // Merge cart items with product data
  const enrichedCart = cartItems.map((item) => {
    const product = products.find(
      (p) => p._id.toString() === item.productId.toString()
    );

    return {
      ...item,
      _id: item.productId, // Ensure _id works as expected in frontend
      name: product?.name || "Unknown Product",
      image: product?.thumbnail || "",
      price: product?.price || 0,
      slug: product?.slug || "#"
    };
  });

  return Response.json(enrichedCart);
}

export async function POST(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { productId, size, color, quantity } = await req.json();

  const productObjectId = new ObjectId(productId); // 💡 Always convert from string
  const product = await db.collection("products").findOne({
    _id: productObjectId,
  });

  if (!product) {
    console.error("❌ Product not found in DB:", productId);
    return new Response("Product not found", { status: 404 });
  }

  // ✅ Insert with product snapshot (faster rendering, no enrichment needed later)
  await db.collection("cart").updateOne(
    {
      userId: new ObjectId(userId),
      productId: productObjectId,
      size,
      color,
    },
    {
      $set: {
        userId: new ObjectId(userId),
        productId: productObjectId,
        size,
        color,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        slug: product.slug,
      },
      $inc: { quantity },
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}


export async function PATCH(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { productId, size, color, quantity } = await req.json();

  await db.collection("cart").updateOne(
    {
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      size,
      color
    },
    {
      $set: { quantity }
    }
  );

  return Response.json({ success: true });
}

export async function DELETE(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { productId, size, color } = await req.json();

  await db.collection("cart").deleteOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(productId),
    size,
    color
  });

  return Response.json({ success: true });
}
