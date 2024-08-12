import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { name, amount, icon } = body;
    const budget = await prisma.budget.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        amount: parseFloat(amount),
        icon,
      },
    });
    return NextResponse.json(budget, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update budget" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const budget = await prisma.budget.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(budget, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to delete budget" },
      { status: 400 }
    );
  }
}
