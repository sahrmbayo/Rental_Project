// app/api/setup-phone/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    // 1️⃣ Update Clerk metadata
    await (await clerkClient()).users.updateUser(userId, {
      publicMetadata: { phone },
    });

    // 2️⃣ Update Prisma DB
    await prisma.agent.update({
      where: { id: userId },
      data: { phone },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to save phone" }, { status: 500 });
  }
}
