'use client'
import { ReactElement, useEffect, useState } from "react";
import styles from "../styles/cart.module.css";
import ItemQuantity from "../components/itemQuantity";
import ICartProductList from "../Interfaces/ICartProductList";
import { createOrder, getCart, updateCart } from "../api/api";
import ICartProduct from "../Interfaces/ICartProduct";
import { toBRL } from "../utils/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import Product from "../product/[id]/page";

interface IProps{
  product: ICartProduct,
  onQuantityChange: (itemId: string, amount: number) => void;
}

function Item(props:IProps): ReactElement{
  return (
      <div className={styles.rowItem}>
          <img src={props.product.thumbnailUrl} alt="" />
          <div className={`${styles.product_description} ${styles.product_title}`}><p>{props.product.title}</p></div>
          <ItemQuantity 
            quantity={props.product.quantity} 
            onIncrease={()=> props.onQuantityChange(props.product.id, 1)}
            onDecrease={()=> props.onQuantityChange(props.product.id, -1)} />
          <div className={styles.sum}>{toBRL(props.product.unitPrice * props.product.quantity)}</div>
      </div>
  );
}

export default function Cart(): ReactElement{

  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [cart, setCart] = useState<ICartProductList>({products: []});
  const FIXED_CART_CODE: string = "fixed-cart-code";

  const router = useRouter();
  
  useEffect(() => {
      getCart(FIXED_CART_CODE).then((json: ICartProductList) => {
        setIsLoaded(true);
        setCart(json);
      },
      (error: Error) =>{
        setIsLoaded(true);
        setError(error);
      })
  }, []);
  

  function handleQuantityChange (itemId: string, amount: number): void {
    const updatedProducts: ICartProduct[] = cart.products.map(product => {
      // update product in cart adding or removing quantity
      if (product.id === itemId) {
        const newQuantity: number = product.quantity + amount;
        return { ...product, quantity: newQuantity };
      }
      return product;
    }).filter((product) => product.quantity > 0); // if quantity is = 0 remove the product

    const updatedCart: ICartProduct[] = updatedProducts;

    setCart({products: updatedCart});
    updateCart(FIXED_CART_CODE, updatedCart);
  }


  function sumary(): number{
    return cart.products.reduce((total:number, product: ICartProduct) => {
      return total + (product.unitPrice * product.quantity);
    }, 0)
  }


  function checkout(): void{
    createOrder(FIXED_CART_CODE).then((json)=>
    {
      router.push(`/checkout/${json.data.id}`);
    }, (error) => {console.log(error)});
    
  }

  
  const content: ReactElement[] = cart.products.map((x: ICartProduct) => (
    <Item product={x} key={x.id} onQuantityChange={handleQuantityChange}/>
  ));
  

  if (error){
    return <div>Erro: ${error!.message}</div>;
  } 
  if (!isLoaded) {
    return <div>Carregando...</div>;
  }

  
  return (
      <div className={styles.container}>
          <div className={styles.hero}><h2>CARRINHO DE COMPRAS</h2></div>
          <div className={styles.rowItem}>
              <div className={`${styles.img_spacing} ${styles.titles}`}></div>
              <div className={`${styles.product_title} ${styles.titles}`}>Produtos</div>
              <div className={`${styles.quantity_box} ${styles.titles}`}><span className={styles.onweb}>Quantidade</span><span  className={styles.onmobile}>Qtde</span></div>
              <div className={`${styles.sum} ${styles.titles}`}>Subtotal</div>
          </div>
                      
          {content}
          
          <div className={styles.rowItem}>
              <div className={`${styles.img_spacing} ${styles.titles_total_amount}`}></div>
              <div className={`${styles.product_title} ${styles.titles_total_amount}`}></div>
              <div className={`${styles.quantity_box} ${styles.titles_total_amount}`}><span className={styles.onweb}>Total</span><span  className={styles.onmobile}>Qtde</span></div>
              <div className={`${styles.sum} ${styles.titles_total_amount}`}>{ toBRL(sumary()) }</div>
          </div>
          <div className={styles.rowItem}>
              <div className={`${styles.img_spacing}`}></div>
              <div className={`${styles.product_title}`}></div>
              <button className={styles.btn_finish_order} onClick={checkout}>Fechar pedido</button>
          </div>
      </div>
  );
}