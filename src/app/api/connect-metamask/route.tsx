import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { walletAddress, signature, message } = await req.json();

    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json(
        { error: "Signature Verification Failed" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: user?.id, walletAddress: user?.walletAddress },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error("Metamask Authentication Error", error);
    return NextResponse.json(
      { error: "Authentication Failed" },
      { status: 500 }
    );
  }
}
