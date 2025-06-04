'use client'
import { ReactElement, useEffect, useState } from "react";
import styles from "../../styles/product.module.css"
import { useParams, useRouter } from 'next/navigation'

import { createOrder, getCart, getProducts, updateCart} from "@/app/api/api";

import IProduct from "@/app/Interfaces/IProduct";
import { toBRL } from "@/app/utils/utils";
import ICartProduct from "@/app/Interfaces/ICartProduct";
import ICartProductList from "@/app/Interfaces/ICartProductList";
import Image from "next/image";



export default function Product(): ReactElement{
    const params = useParams();
    const idProduct = params.id;

    const [error, setError] = useState<Error | string | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [product, setProduct] = useState<IProduct | null>(null);

    const defaultProductImage: string = 'https://placehold.co/100';

    // cart data is needed here because it'll be sent to checkout if buy now is clicked
    const [cart, setCart] = useState<ICartProductList>({products: []});
    const FIXED_CART_CODE: string = "fixed-cart-code";

    const router = useRouter();
      
    // Product
    useEffect(() => {
        getProducts({id: idProduct!.toString()}).then((json: IProduct | {error: string}) => {
            setIsLoaded(true);
            
            // if product doesn't exist
            if( !("error" in json)){ 
                setProduct(json);
            }
        },
        (error) =>{
            setIsLoaded(true);
            setError(error);
        })
    }, [idProduct]);

    // Cart
    // Cart info is got here, because i'll be needed in case of 'add to cart' button is clicked
    useEffect(() => {
        getCart(FIXED_CART_CODE).then((json: ICartProductList) => {
            setIsLoaded(true);
            setCart(json);
        },
        (error: Error) =>{
            setIsLoaded(true);
            setError(error);
        });
    }, []);

    function handleAddProductToCart (buyNow: boolean): void {
    
        if (!product) {
            throw new Error("Produto inválido");
        }

        if (!cart) {
            throw new Error("Cart inválido");
        }
        // Update Cart JSON adding new product 
        let updatedCart: ICartProduct[] = [
            ...cart.products,
            {
                "unitPrice": product?.amount,
                "id": product?.id.toString(),
                "quantity": 1,
                "title": product?.title,
                "thumbnailUrl": "https://placehold.co/100"
            }
        ]

        if(buyNow){ 
            // When buy now is clicked, the cart is emptied and only the choosen product is taken to checkout
            updatedCart = [
                {
                    "unitPrice": product?.amount,
                    "id": product?.id.toString(),
                    "quantity": 1,
                    "title": product?.title,
                    "thumbnailUrl": "https://placehold.co/100"
                }
            ]
        }

        updatedCart = updatedCart.reduce((acc: ICartProduct[], item: ICartProduct) => {
            
            // check if new product exists already in cart
            const existingProduct: ICartProduct | undefined = acc.find(p => p.id === item.id); 
            
            if(existingProduct){ // if it exists add one more to item quantity of product in cart 
                existingProduct.quantity += item.quantity
            }else{ // new item added to cart
                acc.push({...item})
            }
            
            return acc 
        }, []);
    
        updateCart(FIXED_CART_CODE, updatedCart).then(() => {
            if(buyNow){
                
                createOrder(FIXED_CART_CODE).then((json)=>
                {
                    router.push(`/checkout/${json.data.id}`);
                }, (error) => {console.log(error)});
                
            }else{
                router.push(`/cart/`);
            }
        })
      }

  
    if (!isLoaded) return <div>Carregando...</div>;
    if (error) return <div>Erro ao carregar produto</div>;
    if (!product) return <div>Produto não encontrado</div>;
    return (
        <div className={styles.container}>
            <div className={styles.overview}>
                <div className={styles.left_box}>
                    <div className={styles.gallery}>
                        <div className={styles.thumbnail}>
                            <a href="#"><img src={defaultProductImage} alt="" /></a>
                        </div>
                        <div className={styles.thumbnail}>
                            <a href="#"><img src={defaultProductImage} alt="" /></a>
                        </div>
                        <div className={styles.thumbnail}>
                            <a href="#"><img src={defaultProductImage} alt="" /></a>
                        </div>
                    </div>
                    <div className={styles.main_image}>
                        <img src="https://placehold.co/400" alt="" />
                    </div>
                </div>
                <div className={styles.right_box}>
                    <h3>{product!.title}</h3>
                    <h4>{toBRL(product!.amount)}</h4>
                    <p> em {product.installments.number}x de {toBRL(product.installments.total)} {product.installments.fee ? 'com': 'sem'} juros</p> 
                    <button className={styles.price} onClick={(e)=> { e.preventDefault(); handleAddProductToCart(true)}}>Comprar Agora</button>
                    <button className={styles.add_to_cart} onClick={(e)=>{e.preventDefault(); handleAddProductToCart(false)}}>Adicionar ao Carrinho</button>
                </div>                
            </div>
            <div className={styles.description}>
                    <h3>Descrição</h3>
                    <p>Sed voluptatem laborum laborum qui dolor maxime. Neque quis perspiciatis asperiores et. Occaecati laboriosam ipsam nesciunt omnis. Ab numquam aut qui incidunt assumenda et necessitatibus explicabo. Est ex voluptatem quo expedita eveniet. Quibusdam sit rerum explicabo fugit omnis explicabo.</p>

                    <p>Aut dolores beatae unde fugit consectetur tempore saepe. Laborum soluta omnis amet ad dicta. Recusandae et exercitationem rem sed odio perspiciatis.</p>

                    <p>Aut laudantium quo nostrum modi minima. Nisi corporis nobis ea repellat autem autem. Doloremque ut minus sed architecto. Exercitationem tempore quam culpa repellendus hic laudantium minima ut. Provident eos est officiis dolores qui error aspernatur aut.</p>
                </div>
        </div>
    );
}