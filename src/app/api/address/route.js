import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

// 🛡️ Get userId from JWT token in cookie
const getUserIdFromRequest = async (req) => {
  const cookie = req.headers.get("cookie");
  const token = cookie?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};

// 📦 GET: Return all addresses for the logged-in user
export async function GET(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const addresses = await db.collection("addresses").find({ userId: new ObjectId(userId) }).toArray();
  return Response.json(addresses);
}

// ➕ POST: Add a new address
export async function POST(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { label, fullName, phone, address, isDefault = false } = await req.json();

  if (!label || !fullName || !phone || !address) {
    return new Response("Missing fields", { status: 400 });
  }

  // ❗ If this is set as default, unset other defaults
  if (isDefault) {
    await db.collection("addresses").updateMany(
      { userId: new ObjectId(userId), isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  const newAddress = {
    userId: new ObjectId(userId),
    label,
    fullName,
    phone,
    address,
    isDefault,
    createdAt: new Date(),
  };

  const result = await db.collection("addresses").insertOne(newAddress);
  return Response.json({ success: true, _id: result.insertedId });
}

// ✏️ PUT: Update an address by ID
export async function PUT(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { _id, label, fullName, phone, address, isDefault = false } = await req.json();

  if (!_id || !label || !fullName || !phone || !address) {
    return new Response("Missing fields", { status: 400 });
  }

  // ❗ If updating to be default, unset others
  if (isDefault) {
    await db.collection("addresses").updateMany(
      { userId: new ObjectId(userId), isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  await db.collection("addresses").updateOne(
    { _id: new ObjectId(_id), userId: new ObjectId(userId) },
    {
      $set: { label, fullName, phone, address, isDefault },
    }
  );

  return Response.json({ success: true });
}

// ❌ DELETE: Remove address by ID
export async function DELETE(req) {
  const db = await getDb();
  const userId = await getUserIdFromRequest(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { _id } = await req.json();
  if (!_id) return new Response("Missing _id", { status: 400 });

  await db.collection("addresses").deleteOne({
    _id: new ObjectId(_id),
    userId: new ObjectId(userId),
  });

  return Response.json({ success: true });
}
