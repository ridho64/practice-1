import { getDb } from "../mongodb";
import bcrypt from "bcryptjs";

export async function createUser({ name, email, password }) {
  const db = await getDb();

  const existing = await db.collection("users").findOne({ email });
  if (existing) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  await db.collection("users").insertOne(user);

  return {
    name: user.name,
    email: user.email,
  };
}

export async function findUserByEmail(email) {
  const db = await getDb();
  return db.collection("users").findOne({ email });
}
