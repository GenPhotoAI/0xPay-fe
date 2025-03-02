import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/utils/constants';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const stripeId = searchParams.get('stripeId');
    const token = request.headers.get('Authorization');

    try {
        const response = await fetch(`${BACKEND_URL}/merchant/details/${stripeId}`, {
            method: 'GET',
            headers: {
                'Authorization': token || '',
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching merchant:', error);
        return NextResponse.json({ error: 'Failed to fetch merchant' }, { status: 500 });
    }
}