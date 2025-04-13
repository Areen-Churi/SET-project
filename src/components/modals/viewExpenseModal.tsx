import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import { Expense } from "@/lib/store/finance-context";
import { currencyFormatter } from "@/lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";

import { useContext } from "react";
import { financeContext } from "@/lib/store/finance-context";
import { Timestamp } from "firebase/firestore";

import { toast } from "react-toastify";


function ViewExpenseModal({ show, onClose, expense }: {
    show: boolean,
    onClose: Dispatch<SetStateAction<boolean>>,
    expense: Expense
}) {

    const {deleteExpenseItem, deleteExpenseCategory} = useContext(financeContext);

    const deleteExpenseHandler = async () => {
        try{
            await deleteExpenseCategory(expense.id);
            toast.success("Expense Category deleted successfully")
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const deleteExpenseItemHandler = async (item: {
        amount: number;
        createdAt: Timestamp;
        id: string;
    }) => {
        try {
            //Remove the item from the list
            const updatedItems = expense.items.filter((i) => i.id !== item .id);
            //Updated the expense balance
            const updatedExpense = {
                items: [...updatedItems],
                total: expense.total - item.amount,
            };

            await deleteExpenseItem(updatedExpense, expense.id);
            toast.success("Expense Item removed successfully!");
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    return (
    <Modal show={show} onClose={onClose}>
        <div className="flex items-center justify-between">
            <h2 className="text-4xl">{expense.title}</h2>
            <button onClick={deleteExpenseHandler} className="btn btn-danger">Delete</button>
        </div>

        <div>
            <h3 className="my-4 text-2xl">Expense History</h3>
            {expense.items.map((item) => {
                return (
                    <div key={item.id} className="flex items-center justify-between">
                        <small>{item.createdAt.nanoseconds
                        ? new Date(item.createdAt.nanoseconds).toISOString() : 
                        new Date(item.createdAt.seconds * 1000).toISOString() 
                        }</small>
                        <p className="flex items-center gap-2">
                            {currencyFormatter(item.amount)}
                            <button onClick={() => {
                                deleteExpenseItemHandler(item)
                            }}>
                                <FaRegTrashAlt />
                            </button>
                        </p>
                        </div>
                );
            })}
        </div>
    </Modal>
    );
}

export default ViewExpenseModal;