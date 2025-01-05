import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  let account;

  try {
    // Parse the request body
    const body = await req.json();
    account = body.account;

    if (!account) {
      return new Response(JSON.stringify({ error: "Missing account in request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Request body parsing error:", error);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Extract token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing or invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    // Decode the JWT token
    decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || "your_jwt_secret");

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      throw new Error("Invalid or expired token");
    }
  } catch (error) {
    console.error("JWT verification error:", error);
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Update the user's wallet address in the database
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { walletAddress: account },
    });

    console.log("User updated successfully:", updatedUser);

    return new Response(
      JSON.stringify({ message: "Wallet address updated successfully", user: updatedUser }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Database operation failed:", error);
    return new Response(JSON.stringify({ error: "Authentication Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
