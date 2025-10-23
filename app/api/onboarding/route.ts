import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { MongoClient } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    // Get the session to verify the user is logged in
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const formData = await req.json();
    
    // Validate required fields
    if (!formData.companyName || !formData.acn || !formData.street || 
        !formData.state || !formData.postcode || !formData.repName || 
        !formData.email || !formData.signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('InvestorPortal');
    
    try {
      // Store onboarding data
      const onboardingData = {
        userEmail: session.user.email,
        companyName: formData.companyName,
        acn: formData.acn,
        address: {
          street: formData.street,
          state: formData.state,
          postcode: formData.postcode,
        },
        representative: {
          name: formData.repName,
          email: formData.email,
        },
        signature: formData.signature,
        termsAccepted: formData.termsAccepted,
        submittedAt: new Date(),
      };

      // Insert onboarding data
      await db.collection('OnboardingData').insertOne(onboardingData);

      // Update user's onboarding status
      await db.collection('UserLogins').updateOne(
        { email: session.user.email },
        { 
          $set: { 
            onboardingComplete: true,
            onboardingCompletedAt: new Date()
          } 
        }
      );

      return NextResponse.json({ 
        success: true,
        message: 'Onboarding completed successfully' 
      });

    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Onboarding submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit onboarding data' },
      { status: 500 }
    );
  }
}

// GET endpoint to check onboarding status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('InvestorPortal');
    
    try {
      const user = await db.collection('UserLogins').findOne(
        { email: session.user.email },
        { projection: { onboardingComplete: 1 } }
      );

      return NextResponse.json({ 
        onboardingComplete: user?.onboardingComplete || false 
      });

    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    );
  }
}
