import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request, response:Response) {

    const { account} = await req.json();

    // // Verify the wallet address using the signature and message
    // const recoveredAddress = ethers.verifyMessage(message, signature);

    // if (recoveredAddress.toLowerCase() !== account.toLowerCase()) {
    //   return NextResponse.json(
    //     { error: "Signature Verification Failed" },
    //     { status: 401 }
    //   );
    // }

    // Extract token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    console.log(token)

    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    console.log(account)
    try {
    // Update the user's wallet address
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { walletAddress: account },
    });

    return NextResponse.json(
      { message: "Wallet address updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log("Metamask Authentication Error", error);
    return NextResponse.json(
      { error: "Authentication Failed" },
      { status: 500 }
    );
  }
}
