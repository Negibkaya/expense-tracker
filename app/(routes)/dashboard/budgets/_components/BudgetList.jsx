import React from "react";
import CreateBudget from "./CreateBudget";
import { useState, useEffect } from "react";
import BudgetItem from "./BudgetItem";
import { useUser } from "@clerk/nextjs";

export default function BudgetList() {
  const { user, isLoaded } = useUser();
  const [email, setEmail] = useState(null);
  const [budgetList, setBudgetList] = useState([]);

  useEffect(() => {
    if (isLoaded && user) {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      setEmail(userEmail);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (email) {
      console.log("EMAIL: ", email);
      getBudgetList();
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
    } catch (error) {
      console.error("Error fetching budget list:", error);
    }
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget refreshData={() => getBudgetList()} />
        {budgetList.length > 0
          ? budgetList.map((budget) => (
              <BudgetItem key={budget.id} budget={budget} />
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-full bg-slate-200 rounded-lg h-[145px] animate-pulse"
                ></div>
              );
            })}
      </div>
    </div>
  );
}
