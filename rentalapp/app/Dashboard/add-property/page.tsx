import { auth } from "@clerk/nextjs/server";
import AddProperty from "../../components/AddProperty";
import { prisma } from "../../lib/prisma";

export default async function AddPropertyPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  const { userId } = await auth();

  const template =
    from && userId
      ? await prisma.property.findFirst({
          where: { id: from, agentId: userId },
          include: { amenities: { select: { name: true } } },
        })
      : null;

  return <AddProperty template={template} />;
}
