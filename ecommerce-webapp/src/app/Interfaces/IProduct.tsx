import IInstallments from "./IInstallments";

export default interface IProduct {
    amount: number;
    id: number;
    installments: IInstallments;
    title: string;
}