export const getRandomNumber = (min: number, max: number) => {
    if(min > max) [min, max] = [max, min]
    console.log(`Min ${min} e Max ${max}`)
    return Math.floor(Math.random() * (max - min + 1)) + min
}