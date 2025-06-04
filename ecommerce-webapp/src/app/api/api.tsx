import axios from "axios";  
import ICartProduct from "../Interfaces/ICartProduct";


function getBaseURL(): string {
    // const url: string | undefined = 'http://localhost:5000/api'; 
    const url: string | undefined = process.env.NEXT_PUBLIC_BASE_URL;
    if (!url) {
        throw new Error('NEXT_PUBLIC_BASE_URL is not set');
    }
    return url;   
}

export async function getProducts({ query = "", id = "", pageSize = 10, currentPage = 1 }: { query?: string; id?: string; pageSize?:number; currentPage?:number }) {
    const url: string = id
        ? `${getBaseURL()}/products/${id}`
        : `${getBaseURL()}/products?query=${query}&pageSize=${pageSize}&currentPage=${currentPage}`
    
    return fetch(url)
    .then((response: Response) => response.json());
}

export async function getCart(code: string) {
    return fetch(`${getBaseURL()}/cart/${code}`)
    .then((response: Response) => response.json());
}

export async function updateCart(code: string, products: ICartProduct[]) {
    return axios.put(`${getBaseURL()}/cart/${code}`, products);
}

export async function createOrder(code: string) {
    return axios.post(`${getBaseURL()}/order/`, {cart_code:code});
}

export async function getOrder(order_id: string) {
    return fetch(`${getBaseURL()}/order/${order_id}`)
    .then((response: Response) => response.json());;
}