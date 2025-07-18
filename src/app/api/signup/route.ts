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
        const { username, email, password, confirmed_password } = body;
        console.log('Signup request body:', body);

        const response = await fetch(`${carBaseUrl}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            confirmed_password,
          }),
        });

        const data = await response.json();
        console.log('External API signup response:', { status: response.status, data });

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Signup failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in signup API:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}