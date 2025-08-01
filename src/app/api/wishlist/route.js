import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

// 🔐 Extract userId from cookie token
const getUserIdFromRequest = async (req) => {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};

// 🟢 GET Wishlist (products)
export async function GET(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const wishlistItems = await db
    .collection("wishlist")
    .find({ userId: new ObjectId(userId) })
    .toArray();

  const productIds = wishlistItems.map((item) => item.productId);
  const products = await db
    .collection("products")
    .find({ _id: { $in: productIds } })
    .toArray();

  return Response.json(products);
}

// 🔴 DELETE Wishlist item
export async function DELETE(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { productId } = await req.json();
  const productObjectId = new ObjectId(productId);

  await db.collection("wishlist").deleteOne({
    userId: new ObjectId(userId),
    productId: productObjectId,
  });

  return Response.json({ success: true });
}

// 🟡 POST Add to Wishlist
export async function POST(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { productId } = await req.json();
  const productObjectId = new ObjectId(productId);

  await db.collection("wishlist").updateOne(
    {
      userId: new ObjectId(userId),
      productId: productObjectId,
    },
    {
      $set: {
        userId: new ObjectId(userId),
        productId: productObjectId,
      },
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}

// 🧩 OPTIONAL: Bulk Merge Guest Wishlist on Login
export async function PUT(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const items = await req.json(); // expects: [{ productId }, { productId }]
  if (!Array.isArray(items)) return new Response("Invalid format", { status: 400 });

  const operations = items.map((item) => {
    const productObjectId = new ObjectId(item.productId);
    return {
      updateOne: {
        filter: {
          userId: new ObjectId(userId),
          productId: productObjectId,
        },
        update: {
          $set: {
            userId: new ObjectId(userId),
            productId: productObjectId,
          },
        },
        upsert: true,
      },
    };
  });

  await db.collection("wishlist").bulkWrite(operations);
  return Response.json({ success: true });
}
