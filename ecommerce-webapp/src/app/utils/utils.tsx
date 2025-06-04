export function toBRL(n: number): string{
    const formatted: string = new Intl.NumberFormat(
        'pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(n);

    return formatted;
}
