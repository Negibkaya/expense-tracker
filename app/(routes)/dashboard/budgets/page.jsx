"use client";

import BudgetList from "./_components/BudgetList";

export default function BudgetsPage() {
  return (
    <div>
      <div className="p-10">
        <h2 className="font-bold text-3xl">My budgets</h2>
        <BudgetList />
      </div>
    </div>
  );
}
