import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import moment from "moment";

export default function AddExpenses({ budgetId, refreshBudgetData }) {
  const { user } = useUser();

  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const AddNewExpense = async (name, amount) => {
    const response = await fetch("/api/expenses/addexpenses", {
      method: "POST",
      body: JSON.stringify({
        name,
        amount,
        budgetId,
        createdBy: moment().format("YYYY-MM-DD"),
      }),
    });

    if (response.ok) {
      refreshBudgetData();
      toast("New Expense Added!");
    }
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expenses</h2>
      <div className="mt-2">
        <h2 className="text-black font-bold my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-bold my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          type="number"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        className="mt-3"
        disabled={!(name && amount)}
        onClick={() => AddNewExpense(name, amount)}
      >
        Add New Expense
      </Button>
    </div>
  );
}
