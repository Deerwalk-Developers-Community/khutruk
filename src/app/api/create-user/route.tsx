import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: any){
    try{
        const body = await req.json();

        const { email, name, password } = body;

        const user = await prisma.user.create({
            data: {
              email,
              name,
            },
          })
          return NextResponse.json(user, {status: 201})
    }catch (error){
        console.error('Error creating user', error)
        return NextResponse.json({error: 'Error creating user'}, {status: 500})
    }finally{
        await prisma.$disconnect();
    }
}