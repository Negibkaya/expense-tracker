"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import CardInfo from "./_components/CardInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpensesListTable from "./expenses/_components/ExpensesListTable";

function Dashboard() {
  const { user, isLoaded } = useUser();
  const [email, setEmail] = useState(null);
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    if (isLoaded && user) {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      setEmail(userEmail);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (email) {
      getBudgetList();
      getAllExpenses();
    }
  }, [email]);

  const getBudgetList = async () => {
    try {
      const response = await fetch("/api/budgets/getBudgetList", {
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budget list");
      }

      const data = await response.json();
      setBudgetList(data);
      console.log("На странице dashboard", data);
    } catch (error) {
      console.error("Error fetching budget list:", error);
    }
  };

  const getAllExpenses = async () => {
    try {
      const response = await fetch("/api/expenses/getAllExpenses", {
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpensesList(data);
      console.log("На странице expenses", data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className="p-8">
      <h2>Здравствуйте, {user?.fullName} 👌!</h2>
      <p>Here's what happening with your money. Let's manage your budget!</p>
      <CardInfo budgetList={budgetList} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          <BarChartDashboard budgetList={budgetList} />
          <h2 className="font-bold text-lg mt-6">Последние расходы</h2>
          <div className="max-h-screen overflow-y-auto">
            <ExpensesListTable
              expensesList={expensesList}
              refreshBudgetData={() => getBudgetList()}
            />
          </div>
        </div>
        <div className="grid gap-5">
          {/* Перемещаем раздел "Ваши бюджеты" вниз */}
          <h2 className="font-bold text-lg">Ваши бюджеты</h2>
          <div className="max-h-screen overflow-y-auto">
            {budgetList.map((budget) => (
              <BudgetItem key={budget.id} budget={budget} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
