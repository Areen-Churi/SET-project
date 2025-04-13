"use client"

import { createContext, useState, useEffect, useContext } from 'react'
import { authContext } from '../../lib/store/auth-context'

//Firebase
import { db } from "../../lib/firebase"
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, Timestamp, query, where } from "firebase/firestore"

export interface Expense { color: string; items: Array<{ amount: number; createdAt: Timestamp; id: string }>; title: string; total: number, id: string }
export interface Income { amount: number; description: string; createdAt: Timestamp, id: string }

interface FinanceContextType {
    income: Array<Income>;
    expenses: Array<Expense>
    addIncomeItem: (newIncome: Omit<Income, "id">) => Promise<void>;
    removeIncomeItem: (id: string) => Promise<void>;
    addCategory: (category: {
        color: string;
        title: string;
        total: number;
    }) => Promise<void>
    addExpenseItem: (selectedCategory: string, newExpense: Omit<Expense, "id">) => Promise<void>;
    deleteExpenseItem: (updatedExpense: Omit<Expense, "id" | "title" | "color">, id: string) => Promise<void>
    deleteExpenseCategory: (id: string) => Promise<void>
}


export const financeContext = createContext<FinanceContextType>({
    income: [],
    expenses: [],
    addIncomeItem: async () => { },
    removeIncomeItem: async () => { },
    addExpenseItem: async () => { },
    addCategory: async () => { },
    deleteExpenseItem: async () => { },
    deleteExpenseCategory: async () => { }
});

export default function FinanceContextProvider({ children }: {
    children: React.ReactNode
}) {
    const [income, setIncome] = useState<Income[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const { user } = useContext(authContext);

    const addCategory = async (category: {
        color: string;
        title: string;
        total: number;
    }) => {
        try {
            const collectionRef = collection(db, "expenses");
            if (!user) return;

            const docSnap = await addDoc(collectionRef, {

                uid: user.uid,
                ...category,
                items: [],
            });

            setExpenses(prevExpenses => {
                return [
                    ...prevExpenses,
                    {
                        id: docSnap.id,
                        uid: user.uid,
                        items: [],
                        ...category
                    }
                ]
            })
        } catch (error) {
            throw error;
        }
    };

    const addExpenseItem = async (expenseCategoryId: string, newExpense: Omit<Expense, "id">) => {
        const docRef = doc(db, "expenses", expenseCategoryId)

        try {
            await updateDoc(docRef, { ...newExpense })

            //Update State
            setExpenses(prevState => {
                const updatedExpenses = [...prevState]

                const foundIndex = updatedExpenses.findIndex((expense) => {
                    return expense.id === expenseCategoryId
                })

                updatedExpenses[foundIndex] = { id: expenseCategoryId, ...newExpense }

                return updatedExpenses;
            });

        } catch (error) {
            throw error;
        }
    };

    const deleteExpenseItem = async (updatedExpense: Omit<Expense, "id" | "title" | "color">, expenseCategoryId: string) => {
        try {
            const docRef = doc(db, "expenses", expenseCategoryId);
            await updateDoc(docRef, {
                ...updatedExpense,
            });

            setExpenses(prevExpenses => {
                const updatedExpenses = [...prevExpenses];
                const pos = updatedExpenses.findIndex((ex) => ex.id === expenseCategoryId);
                updatedExpenses[pos].items = [...updatedExpense.items];
                updatedExpenses[pos].total = updatedExpense.total;

                return updatedExpenses;
            })
        } catch (error) {
            throw error;
        }
    };

    const deleteExpenseCategory = async (expenseCategoryId: string) => {
        try {
            const docRef = doc(db, "expenses", expenseCategoryId);
            await deleteDoc(docRef);

            setExpenses((prevExpenses) => {
                const updatedExpenses = prevExpenses.filter(
                    (expense) => expense.id !== expenseCategoryId
                );

                return [...updatedExpenses];
            });
        } catch (error) {
            throw error;
        }
    }

    const addIncomeItem = async (newIncome: Omit<Income, "id">) => {
        const collectionRef = collection(db, 'income')

        try {
            const docSnap = await addDoc(collectionRef, newIncome);

            //Update State
            setIncome((prevState: Array<Income>) => {
                return [
                    ...prevState,
                    {
                        id: docSnap.id,
                        ...newIncome,
                    },
                ];
            });


        } catch (error: any) {
            console.log(error.message);
            throw error
        }
    }
    const removeIncomeItem = async (incomeId: string) => {
        const docRef = doc(db, 'income', incomeId)
        try {
            await deleteDoc(docRef);
            setIncome(prevState => {
                return prevState.filter(i => i.id !== incomeId);
            });
            //Update State
        } catch (error: any) {
            console.log(error.message);
            throw error
        }
    }

    const values = { income, expenses, addIncomeItem, removeIncomeItem, addExpenseItem, addCategory, deleteExpenseItem, deleteExpenseCategory };

    useEffect(() => {
        if (!user) return;

        const getIncomeData = async () => {
            const collectionRef = collection(db, 'income')
            const q = query(collectionRef, where("uid", '==', user.uid))

            const docsSnap = await getDocs(q);

            const data = docsSnap.docs.map(doc => {
                const d = doc.data()
                return {
                    id: doc.id,
                    description: d.description,
                    amount: d.amount,
                    createdAt: doc.data().createdAt.toMillis()
                } as Income;
            });

            setIncome(data);
        };

        const getExpensesData = async () => {
            const collectionRef = collection(db, 'expenses')
            const q = query(collectionRef, where("uid", '==', user.uid))
            const docsSnap = await getDocs(q);

            const data = docsSnap.docs.map((doc) => {
                const d = doc.data()
                return {
                    id: doc.id,
                    description: d.description,
                    color: d.color,
                    items: d.items,
                    title: d.title,
                    total: d.total
                } as Expense;
            })

            setExpenses(data);
        };

        getIncomeData();
        getExpensesData();
    }, [user]);


    return (
        <financeContext.Provider
            value={values}>
            {children}
        </financeContext.Provider>
    );
};

