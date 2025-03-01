import { BACKEND_URL, JUP_API_URL } from "./constants";
import { allTokens } from "./tokenLists";

export const getTokenAddress = async (symbol: string) => {
    const tokenAddress = allTokens.find((token) => token.symbol === symbol)?.address;
    const tokens = await fetch(`https://api.jup.ag/tokens/v1/token/${tokenAddress}`)
    const data = await tokens.json();
    return data;
}

// export const createPayment = async (tokenSymbol: string, tokenAddress: string, decimals: number, amount: string) => {
//     try {
//         const response = await fetch(`${JUP_API_URL}/payment/create`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 tokenSymbol,
//                 tokenAddress,
//                 decimals,
//                 amount
//             })
//         });

//         if (!response.ok) {
//             throw new Error('Payment creation failed');
//         }

//         return response.json();
//     } catch (error) {
//         console.error('Error creating payment:', error);
//         return null;
//     }
// }

export const getQuote = async (inputMint: string, outputMint: string, amount: string) => {
    const quote = await fetch(`https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50&restrictIntermediateTokens=true`)
    const data = await quote.json();
    return data;
}

export const getSwap = async (inputMint: string, outputMint: string, amount: string) => {
    const swap = await fetch(`https://api.jup.ag/swap/v1/swap?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50&restrictIntermediateTokens=true`)
    const data = await swap.json();
    console.log(data);
    return data;
}