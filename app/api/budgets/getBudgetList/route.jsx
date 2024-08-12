import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log("Email: ", email);
    const budgetList = await prisma.budget.findMany({
      where: {
        createdBy: email,
      },
      include: {
        expenses: true,
      },
    });

    const budgetListWithTotals = budgetList.map((budget) => {
      const totalSpend = budget.expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const remainingAmount = budget.amount - totalSpend;
      return {
        ...budget,
        totalSpend,
        totalItems: budget.expenses.length,
        remainingAmount,
      };
    });

    return NextResponse.json(budgetListWithTotals);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to get budget list" },
      { status: 400 }
    );
  }
}
