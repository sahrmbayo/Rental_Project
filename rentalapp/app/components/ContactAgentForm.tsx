'use client';

import { useState } from 'react';
import { Mail, User, MessageSquare } from 'lucide-react';

export default function ContactAgentForm({ agentName, agentId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, you would send this data to an API route:
    // await fetch('/api/contact-agent', { method: 'POST', body: JSON.stringify({ name, email, message, agentId }) });

    // For now, we'll just simulate the submission
    setTimeout(() => {
      alert(`Message sent to ${agentName}!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="sr-only">Your Name</label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="w-full rounded-md border-gray-300 py-2 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="sr-only">Your Email</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
            className="w-full rounded-md border-gray-300 py-2 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="sr-only">Message</label>
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`I am interested in this property...`}
            required
            className="w-full rounded-md border-gray-300 py-2 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
