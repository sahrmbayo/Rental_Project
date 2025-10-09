import ContactForm from '../components/ContactForm';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import Header from '../components/header';
import { Metadata } from 'next';
import BackToHomeButton from '../components/BackToHomeButton';

export const metadata: Metadata = {
  title: 'Contact Us | Salone Rent',
  description: 'Get in touch with us for any inquiries or support.',
};

export default function ContactPage() {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help and answer any questions you might have. 
              We look forward to hearing from you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="mt-1 text-sm text-gray-600">
                      <a href="tel:+23275088079" className="hover:text-blue-600">
                        +232 75 088 079
                      </a>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Mon-Fri 9AM-6PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="mt-1 text-sm text-gray-600">
                      <a href="mailto:support@yourcompany.com" className="hover:text-blue-600">
                        sbmbayo02@gmail.com
                      </a>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">We reply within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPinIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Office</p>
                    <p className="mt-1 text-sm text-gray-600">
                      City Plaza<br />
                      Bambawa<br />
                      All Cities we cover.
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Response Time</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Usually within 2-4 hours
                    </p>
                    <p className="text-xs text-gray-500 mt-1">During business hours</p>
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-900">
                      Need immediate help?
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Check our FAQ or start a live chat for instant assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How quickly will you respond?
                </h3>
                <p className="text-gray-600">
                  We typically respond within 24-48 hours, often much faster during business hours.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What information should I include?
                </h3>
                <p className="text-gray-600">
                  Please provide as much detail as possible about your question or issue. 
                  Include relevant dates, order numbers, or screenshots if applicable.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you offer phone support?
                </h3>
                <p className="text-gray-600">
                  Yes! You can reach us at +23275088079 during business hours 
                  (Monday-Friday, 9AM-6PM EST).
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I visit your office?
                </h3>
                <p className="text-gray-600">
                  Absolutely! We're located at city plaza in every city and welcome
                  visitors. Please call ahead to schedule an appointment.
                </p>
              </div>
              <BackToHomeButton />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}