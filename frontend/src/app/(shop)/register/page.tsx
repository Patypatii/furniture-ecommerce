import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Create Account',
    description: 'Create your Tangerine Furniture account.',
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-gray-600">Join Tangerine Furniture today</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <RegisterForm />

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary font-medium hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

