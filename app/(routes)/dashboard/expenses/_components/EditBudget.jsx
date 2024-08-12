import React from "react";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EditBudget({ budgetParams, refreshBudgetData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetParams.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [budgetName, setBudgetName] = useState(budgetParams.name);
  const [budgetAmount, setBudgetAmount] = useState(budgetParams.amount);

  const onEditBudget = async () => {
    const response = await fetch("/api/budgets", {
      method: "PUT",
      body: JSON.stringify({
        id: budgetParams.id,
        name: budgetName,
        amount: parseFloat(budgetAmount),
        icon: emojiIcon,
      }),
    });

    if (response.ok) {
      refreshBudgetData();
      toast("Budget updated!");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2">
            <PenBox /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit budget</DialogTitle>
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
                    value={emojiIcon}
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
                    value={budgetName}
                    placeholder="e.g. Groceries"
                    type="text"
                    onChange={(e) => setBudgetName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-bold my-1">Budget Amount</h2>
                  <Input
                    value={budgetAmount}
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
                onClick={() => onEditBudget()}
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
