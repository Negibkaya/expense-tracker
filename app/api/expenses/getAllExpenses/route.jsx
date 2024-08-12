import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    console.log(body);
    const { email } = body;
    const budgetList = await prisma.budget.findMany({
      where: {
        createdBy: email,
      },
      include: {
        expenses: true,
      },
    });

    const expensesList = budgetList.flatMap((budget) =>
      budget.expenses.map((expense) => ({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        createdBy: expense.createdBy,
      }))
    );

    return NextResponse.json(expensesList);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch expenses" },
      { status: 400 }
    );
  }
}
