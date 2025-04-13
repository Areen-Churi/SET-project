import { useRef, useContext, SetStateAction, Dispatch } from "react";
import { currencyFormatter } from "@/lib/utils";

import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-context";

import { toast } from "react-toastify";


//Icons
import { FaRegTrashAlt } from "react-icons/fa"
import Modal from "../../components/Modal"
import { Timestamp } from "firebase/firestore";



function AddIncomeModal({ show, onClose }: {
    show: boolean,
    onClose: Dispatch<SetStateAction<boolean>>
}) {

    const amountRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null);
    const { income, addIncomeItem, removeIncomeItem } = useContext(financeContext);

    const { user } = useContext(authContext);


    //Handler Functions
    const addIncomeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newIncome = {
            amount: parseInt(amountRef.current ? amountRef.current.value : "0"),
            description: descriptionRef.current ? descriptionRef.current.value : "",
            createdAt: Timestamp.fromDate(new Date()),
            uid: user!.uid,
        };

        try {
            await addIncomeItem(newIncome);
            descriptionRef.current!.value = "";
            amountRef.current!.value = "";
            toast.success("Income Added Successfully!!")
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const deleteIncomeEntryHandler = async (incomeId: string) => {
        try {
            removeIncomeItem(incomeId);
            toast.success("Income Deleted Successfully.");
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    };



    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={addIncomeHandler} className="flex flex-col gap-4">
                <div className="input-group">
                    <label htmlFor="amount">Income Amount</label>
                    <input
                        type="number"
                        name="amount"
                        ref={amountRef}
                        min={0.01}
                        step={0.01}
                        placeholder="Enter income amount"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        name="description"
                        ref={descriptionRef}
                        placeholder="Enter income description"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Add entry</button>
            </form>

            <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-2xl font-bold">Income History</h3>
                <div className="flex flex-col gap-4 mt-6 h-64 pe-8 overflow-y-auto">                    
                    {income.map(i => {
                        const time = new Date(i.createdAt as unknown as number)
                        console.log(time, i.createdAt as unknown as number)                    
                        return (
                            <div className="flex items-center justify-between" key={i.id}>
                                <div>
                                    <p className="font-semibold">{i.description}</p>
                                    <small className="text-xs">{time.toLocaleDateString() !== "Invalid Date" ? time.toLocaleDateString() : time.toLocaleTimeString()}</small>
                                </div>
                                <p className="flex items-center gap-2">
                                    {currencyFormatter(i.amount)}
                                    <button onClick={() => { deleteIncomeEntryHandler(i.id) }}>
                                        <FaRegTrashAlt />
                                    </button>
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    )
}

export default AddIncomeModal;