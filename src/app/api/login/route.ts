import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const carBaseUrl = process.env.CAR_BASE_URL;
        if (!carBaseUrl) {
            console.error('CAR_BASE_URL is not defined');
            return NextResponse.json(
                { message: 'Server configuration error: CAR_BASE_URL is not defined' },
                { status: 500 }
            );
        }

         const body = await req.json();
         const { email, password } = body;
        console.log('Login request body:', body);

        const response = await fetch(`${carBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        const data = await response.json();
        console.log('External API login response:', { status: response.status, data });

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Login failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in login API:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}