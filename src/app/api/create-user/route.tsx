import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, name, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, 
      },
    });
    console.log("User created", user);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
