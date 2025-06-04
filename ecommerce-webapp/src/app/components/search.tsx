import styles from "../styles/search.module.css";
import React, {ReactElement, useState} from "react";

interface IPros{
    onSearch: (query: string) => void
}

export default function Search(props: IPros): ReactElement{

    const [query, setQuery] = useState<string>("");

    function searchProducts(): void{
        props.onSearch(query)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void{
        setQuery(e.target.value);
    }

    function handleKeyDown (e: React.KeyboardEvent<HTMLInputElement>): void{
        if(e.key === 'Enter'){
            searchProducts()
        }
    }
    return (
        <div className={styles.container}>
                <input type="text"
                    name="search" 
                    placeholder="Digite o nome do produto, por exemplo"
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown}
                    />
                <button id="btn-search" onClick={searchProducts}>Buscar</button>
        </div>
    );
}