'use client'
import { ReactElement, useEffect, useState } from "react";
import styles from "../../styles/checkout.module.css";
import { toBRL } from "../../utils/utils";
import { useParams, useRouter } from "next/navigation";
import { getOrder } from "@/app/api/api";

interface IProduct {
  id: number;
  quantity: number;
  thumbnailUrl: string;
  title: string;
  unitPrice: string;
}

interface IOrder {
  amount: string;
  created_at: string;
  id: number;
  products: IProduct[];
  updated_at: string;
  status: string;
}


export default function Checkout(): ReactElement{
    const params = useParams();
    const orderId = params.id;

    const router = useRouter();
    const [order, setOrder] = useState<IOrder>();

    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(()=>{
        if(orderId){
            getOrder(orderId.toString()).then((json:IOrder) => {
                setOrder(json);
                setIsLoaded(true);
                setError(null)
            }, (error: Error)=>{
                setError(error);
                setIsLoaded(false);
            });
        }

    }, []);

    if (error){
        return <div>Erro: ${error!.message}</div>;
    } 
    if (!isLoaded) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.hero}><h2>PEDIDO FINALIZADO 🎉</h2></div>
            <div className={styles.rowItem}>
                <p> O seu pedido foi finlizado com sucesso. </p>
                <table>
                    <thead>
                        <tr><td>Id</td><td>Status</td><td>Total</td></tr>
                    </thead>
                    <tbody>
                       
                        <tr><td>{order!.id}</td><td>{order!.status}</td><td>{toBRL(+order!.amount!)}</td></tr>
                       
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr><td>Produtos</td><td>Qtde</td><td>Preço unitário</td><td>Total</td></tr>
                    </thead>
                    <tbody>
                        {order?.products.map((x) => (
                        <tr key={x.id}><td>{x.title}</td><td>{x.quantity}</td><td>{toBRL(+x.unitPrice)}</td><td>{toBRL(+x.unitPrice * x.quantity)}</td></tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr><td></td><td></td><td></td><td>{toBRL(+order!.amount!)}</td></tr>
                    </tfoot>
                </table>
                <p>
                    Se isso fosse um e-commerce de verdade, provavelmente você receberia alguma coisa.
                    Porém, este é apenas um exercício. Então, não vamos lhe entregar nada.
                </p>
                <p>
                    De qualquer forma, obrigado pela preferência!
                </p>
                <button className={styles.btn_back_to_products_list} onClick={(e)=> {e.preventDefault(); router.push('/')}}>Ver mais produtos</button>
            </div>
        </div>
    );
}