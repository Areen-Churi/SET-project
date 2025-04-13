import { useState } from "react";

import { currencyFormatter } from "../lib/utils";

import ViewExpenseModal from "./modals/viewExpenseModal";
import { Expense } from "@/lib/store/finance-context";

function ExpenseCategoryitem({ expense }: {
  expense: Expense
}) {
  const [showViewExpenseModal, setViewExpenseModal] = useState(false);


  return (
    <>
      <ViewExpenseModal
        show={showViewExpenseModal}
        onClose={setViewExpenseModal}
        expense={expense}
      />
      <button onClick={() => { 
        setViewExpenseModal(true);
       }}>
        <div className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl">
          <div className="flex items-center gap-2">
            <div className="w-[25px] h-[25px] rounded-full" style={{ backgroundColor: expense.color }} />
            <h4 className="capitalise">{expense.title}</h4>
          </div>
          <p>{currencyFormatter(expense.total)}</p>
        </div>
      </button>
    </>
  );
}

export default ExpenseCategoryitem;