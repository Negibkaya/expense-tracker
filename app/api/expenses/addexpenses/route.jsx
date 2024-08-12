import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, amount, budgetId, createdBy } = body;
    const newExpense = await prisma.expense.create({
      data: {
        name,
        amount: parseFloat(amount),
        budgetId,
        createdBy,
      },
    });
    return NextResponse.json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
