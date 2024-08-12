import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function CreateBudget({ refreshData }) {
  const { user } = useUser();

  const [emojiIcon, setEmojiIcon] = useState("😁");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState(0);

  const onCreateBudget = async () => {
    const response = await fetch("/api/budgets", {
      method: "POST",
      body: JSON.stringify({
        name: budgetName,
        amount: parseFloat(budgetAmount),
        icon: emojiIcon,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      }),
    });

    if (response.ok) {
      refreshData();
      toast("New budget created!");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-md flex items-center flex-col border-2 border-black border-dashed cursor-pointer hover:shadow-md">
            <h2 className="text-3xl">+</h2>
            <h2>Create new budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-bold my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Groceries"
                    type="text"
                    onChange={(e) => setBudgetName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-bold my-1">Budget Amount</h2>
                  <Input
                    placeholder="e.g. 5000$"
                    type="number"
                    onChange={(e) => setBudgetAmount(e.target.value)}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                className="mt-5 w-full"
                disabled={!(budgetName && budgetAmount)}
                onClick={() => onCreateBudget()}
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
