import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { id } = body;

    const budget = await prisma.budget.findUnique({
      where: {
        id: id,
      },
      include: {
        expenses: true,
      },
    });

    const totalSpend = budget.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const remainingAmount = budget.amount - totalSpend;

    return NextResponse.json({
      ...budget,
      totalSpend,
      totalItems: budget.expenses.length,
      remainingAmount,
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const body = await request.json();
    const { id } = body;
    const expense = await prisma.expense.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
