'use client'
import { ReactElement } from "react";
import ProductsList from "./components/productsList";

export default function Home(): ReactElement {
    
    return (
        <div>
            <ProductsList />            
        </div>
    );
}
