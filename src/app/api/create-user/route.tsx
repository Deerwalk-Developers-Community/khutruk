import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const auth = await prisma.auth.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const user = await prisma.user.create({
      data: {
        auth: {
          connect: { id: auth.id },
        },
      },
    });

    console.log("User and Auth created", { auth, user });
    return NextResponse.json({ auth, user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user and auth", error);
    return NextResponse.json({ error: "Error creating user and auth" }, { status: 500 });
  }
}
