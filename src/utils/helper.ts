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
    const quote = await fetch(`https://api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50&restrictIntermediateTokens=true&swapMode=ExactOut`)
    const data = await quote.json();
    return data;
}

export const getMerchant = async (stripeId: string, token: string) => {
    try {
        const response = await fetch(`/api/merchant?stripeId=${stripeId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching merchant:', error);
        return null;
    }
}

export const createMerchant = async (formData: any, token: string, userId: string) => {

    const formattedFormData = {
        name: formData.username,
        address: formData.solAddress,
        stripeId: userId,
    }
    try {
        const response = await fetch(`${BACKEND_URL}/merchant/create/account`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedFormData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating merchant:', error);
        return null;
    }
}


export const createCollection = async (formData: any, token: string, userId: string) => {


    const amount = formData.amount * 10 ** 6;
    const formattedFormData = {
        stripeId: userId,
        amount: amount
    }

    try {
        const response = await fetch(`${BACKEND_URL}/merchant/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedFormData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating collection:', error);
        return null;
    }

}


export const getCollections = async (token: string, userId: string) => {
    const response = await fetch(`${BACKEND_URL}/merchant/get/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    return data;
}


export const submitPaymentConfirmation = async (paymentId: string, signature: string, userAddress: string, userTokenDecimals: string, inputTokenSymbol: string) => {
    const response = await fetch(`${BACKEND_URL}/user/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            paymentsRequestId: paymentId,
            address: userAddress,  // userAddress
            inputToken: inputTokenSymbol,    // SOL
            inputTokenDecimals: userTokenDecimals,  // userTokenDecimals
            transactionHash: signature,
        })
    });
    const data = await response.json();
    return data;
}
