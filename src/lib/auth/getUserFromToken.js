import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function getUserFromToken(req) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();

    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) return null;

    // Optional: sanitize password before sending
    delete user.password;
    return user;

  } catch {
    return null;
  }
}
