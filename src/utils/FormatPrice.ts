export const FormatPrice = (amount: number) => {
    return new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA"
    }).format(amount)
}