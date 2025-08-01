import { NextResponse } from "next/server";
import { createUser } from "@/lib/models/user";
import { z } from "zod";


// 🔐 Validation schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const formattedErrors = {};
      for (const err of parsed.error.errors) {
        formattedErrors[err.path[0]] = [err.message];
      }
      return NextResponse.json({ error: formattedErrors }, { status: 400 });
    }

    const user = await createUser(parsed.data);
    return NextResponse.json({ message: "User created", user }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
