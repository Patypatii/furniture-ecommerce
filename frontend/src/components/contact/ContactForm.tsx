'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            // TODO: Send contact form to API
            console.log('Contact form data:', data);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setSubmitted(true);
            reset();
            setTimeout(() => setSubmitted(false), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

            {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    Thank you for your message! We'll get back to you soon.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            First Name *
                        </label>
                        <input
                            {...register('firstName', { required: 'First name is required' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            placeholder="John"
                        />
                        {errors.firstName && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.firstName.message as string}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Last Name *
                        </label>
                        <input
                            {...register('lastName', { required: 'Last name is required' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            placeholder="Doe"
                        />
                        {errors.lastName && (
                            <span className="text-red-500 text-sm mt-1 block">{errors.lastName.message as string}</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm mt-1 block">{errors.email.message as string}</span>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        {...register('phone')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="+254 700 123 456"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Subject *
                    </label>
                    <input
                        {...register('subject', { required: 'Subject is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="How can we help you?"
                    />
                    {errors.subject && (
                        <span className="text-red-500 text-sm mt-1 block">{errors.subject.message as string}</span>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Message *
                    </label>
                    <textarea
                        rows={6}
                        {...register('message', { required: 'Message is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                        placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                        <span className="text-red-500 text-sm mt-1 block">{errors.message.message as string}</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting && (
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}

