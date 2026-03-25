import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone, password, confirmPassword } = body;

    // Validate inputs
    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { error: 'Email/phone and password are required' },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Determine if input is email or phone
    const isEmail = emailOrPhone.includes('@');
    const isPhone = /^\+?[\d\s-()]+$/.test(emailOrPhone);

    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { error: 'Invalid email or phone format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: isEmail ? emailOrPhone : undefined },
          { phone: isPhone ? emailOrPhone : undefined }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Account already exists with this email or phone' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create user
    const user = await prisma.user.create({
      data: {
        email: isEmail ? emailOrPhone : null,
        phone: isPhone ? emailOrPhone : null,
        password: hashedPassword,
        inviteCode,
        vipLevel: 1,
        balance: 0,
        sharesHeld: 0,
        integrationPoints: 0,
        creditPoints: 0,
      }
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
