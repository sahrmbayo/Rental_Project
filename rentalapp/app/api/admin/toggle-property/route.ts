// app/admin/toggle-property/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

const SUPER_ADMIN_ID = process.env.SBM;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId || userId !== SUPER_ADMIN_ID) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    const current = await prisma.property.findUnique({
      where: { id },
      select: { isAvailable: true },
    });

    if (!current) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: { isAvailable: !current.isAvailable },
      select: { id: true, isAvailable: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
