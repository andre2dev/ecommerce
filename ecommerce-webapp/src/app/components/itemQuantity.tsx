import React, { ReactElement} from "react";
import styles from "../styles/cart.module.css";

interface IProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}
export default function ItemQuantity(props: IProps): ReactElement{
    return (
        <div className={styles.quantity_box}>
            <div>
                <a href="#" onClick={(e)=>{e.preventDefault(); props.onDecrease()}}>-</a></div>
            <div>{props.quantity}</div>
            <div>
                <a href="#" onClick={(e)=>{e.preventDefault(); props.onIncrease()}}>+</a></div>
        </div>
    );
}