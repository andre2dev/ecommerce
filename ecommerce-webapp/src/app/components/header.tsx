
'use client'
import Link from "next/link";
import styles from "../styles/header.module.css";
import React, {ReactElement} from "react";
import { usePathname } from "next/navigation";

export default function Header(): ReactElement{

    const pathName = usePathname()

    return (
        <div className={styles.header}>
            <div>
                <p><Link href="/" onClick={(e) => {
                        if (pathName === '/') {
                            e.preventDefault();
                            window.location.reload();
                        }
                    }}>PRODUTOS</Link></p>
                <p><Link href={`/cart`}>CARRINHO DE COMPRAS</Link></p>
            </div>
            <h1>E-Commerce</h1>    
        </div>
    );
}