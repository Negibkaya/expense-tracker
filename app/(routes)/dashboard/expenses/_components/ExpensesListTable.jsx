import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function ExpensesListTable({ expensesList, refreshBudgetData }) {
  const deleteExpenses = async (id) => {
    const response = await fetch("/api/expenses", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
    });
    if (response.ok) {
      refreshBudgetData();
      toast("Expense deleted");
    }
  };

  console.log("Полученный с обычного GET", expensesList);

  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 bg-slate-200 p-2">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>

      {}

      {expensesList.map((expense) => (
        <div className="grid grid-cols-4 bg-slate-100 p-2">
          <h2>{expense.name}</h2>
          <h2>${expense.amount}</h2>
          <h2>{expense.createdBy}</h2>
          <h2>
            <Trash
              className="text-red-500"
              onClick={() => deleteExpenses(expense.id)}
            />
          </h2>
        </div>
      ))}
    </div>
  );
}
