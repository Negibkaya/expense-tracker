import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { name, amount, icon, createdBy } = body;
    const budget = await prisma.budget.create({
      data: {
        name,
        amount: parseFloat(amount),
        icon,
        createdBy,
      },
    });
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create budget" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        expenses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const budgetsWithStats = budgets.map((budget) => {
      const totalSpend = budget.expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const remainingAmount = budget.amount - totalSpend;
      return {
        ...budget,
        totalItems: budget.expenses.length,
        totalSpend,
        remainingAmount,
      };
    });

    return NextResponse.json(budgetsWithStats);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch budgets" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const body = await request.json();
    const { id } = body;
    const budget = await prisma.budget.delete({
      where: {
        id: id,
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

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { id, name, amount, icon } = body;
    console.log("DATA: ", name, amount, icon);
    console.log("ID: ", id);
    const budget = await prisma.budget.update({
      where: {
        id: id,
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
