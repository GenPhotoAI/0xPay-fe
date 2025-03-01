import { BACKEND_URL } from "./constants";

const allTokens = [
    {
        symbol: "JUP",
        address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
    },
    {
        symbol: "USDC",
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    },
    
]

export const getTokenAddress = async (symbol: string) => {
    const tokenAddress = allTokens.find((token) => token.symbol === symbol)?.address;
    try {
        const tokens = await fetch(`${BACKEND_URL}/tokens/v1/token/${tokenAddress}`)    
        const data = await tokens.json();
        return data;
    } catch (error) {
        console.error('Error fetching token address:', error);
        return null;
    }
}
