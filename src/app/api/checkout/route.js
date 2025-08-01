// ✅ File: src/app/api/checkout/route.js
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const getUserIdFromRequest = async (req) => {
  const cookie = req.headers.get("cookie");
  const token = cookie?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};

export async function POST(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { shippingAddress, items, totalAmount } = await req.json();

  if (!shippingAddress || !items?.length || !totalAmount) {
    return new Response("Invalid order data", { status: 400 });
  }

  await db.collection("orders").insertOne({
    userId: new ObjectId(userId),
    shippingAddress,
    items,
    totalAmount,
    status: "pending",
    createdAt: new Date(),
  });

  return Response.json({ success: true });
}
