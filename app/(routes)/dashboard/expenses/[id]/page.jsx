"use client";

import { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpenses from "../_components/AddExpenses";
import ExpensesListTable from "../_components/ExpensesListTable";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";

export default function ExpensesPage({ params }) {
  const [budgetData, setBudgetData] = useState(null);
  const { id } = params;

  const router = useRouter();

  useEffect(() => {
    fetchBudget();
  }, [id]);

  const fetchBudget = async () => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budget");
      }

      const data = await response.json();
      setBudgetData(data);
      console.log("На странице budget", data);
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  };

  const deleteBudget = async () => {
    try {
      const response = await fetch("/api/budgets", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      router.push("/dashboard/budgets");
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  if (!budgetData) return null;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold flex justify-between items-center">
        <span>My Expenses</span>
        <div className="flex gap-2 items-center">
          <EditBudget
            budgetParams={budgetData}
            refreshBudgetData={() => fetchBudget()}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2" variant="destructive">
                <Trash /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with all of its expenses and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-6">
        {budgetData ? (
          <BudgetItem budget={budgetData} />
        ) : (
          <div className="w-full bg-slate-200 rounded-lg h-[145px] animate-pulse"></div>
        )}
        <AddExpenses budgetId={id} refreshBudgetData={() => fetchBudget()} />
      </div>
      <div>
        <h2 className="text-2xl font-bold mt-10">Latest Expenses</h2>
        <ExpensesListTable
          expensesList={budgetData.expenses}
          refreshBudgetData={() => fetchBudget()}
        />
      </div>
    </div>
  );
}
