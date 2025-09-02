// import React, { useState } from 'react';
// import { Mail, Clock, MapPin } from 'lucide-react';

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     message: ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <section id="contact" className="py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Contact Form */}
//           <div>
//             <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium mb-1">
//                   Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   required
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium mb-1">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium mb-1">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="message" className="block text-sm font-medium mb-1">
//                   Message *
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   required
//                   value={formData.message}
//                   onChange={handleChange}
//                   rows={4}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 ></textarea>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
//               >
//                 Send Message
//               </button>
//             </form>
//           </div>

//           {/* Contact Information */}
//           <div className="lg:pl-12">
//             <h2 className="text-4xl font-bold mb-8">Contact Information</h2>
//             <div className="space-y-6">
//               <div className="flex items-start">
//                 <MapPin className="h-6 w-6 text-green-600 mt-1" />
//                 <div className="ml-4">
//                   <h3 className="text-xl font-semibold">Location</h3>
//                   <p className="mt-2 text-gray-700 dark:text-gray-300">
//                     Hyderabad, Telangana<br />
//                     India
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <Mail className="h-6 w-6 text-green-600 mt-1" />
//                 <div className="ml-4">
//                   <h3 className="text-xl font-semibold">Email</h3>
//                   <a 
//                     href="mailto:contact@talqs.ai"
//                     className="text-green-600 hover:text-green-700 mt-2 inline-block"
//                   >
//                     contact@talqs.ai
//                   </a>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <Clock className="h-6 w-6 text-green-600 mt-1" />
//                 <div className="ml-4">
//                   <h3 className="text-xl font-semibold">Working Hours</h3>
//                   <p className="mt-2 text-gray-700 dark:text-gray-300">
//                     Monday - Friday: 9:00 AM - 6:00 PM<br />
//                     Saturday: 9:00 AM - 1:00 PM
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;
import React, { useState } from 'react';
import { Mail, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmitStatus('success');
        setStatusMessage('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.message || 'Failed to send message. Please try again.');
        console.error('Server error:', result.message);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
      setStatusMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Have questions about our AI-powered legal solutions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Your phone number"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical"
                  placeholder="Tell us about your legal technology needs..."
                />
              </div>

              {/* Status Message */}
              {submitStatus !== 'idle' && (
                <div className={`p-4 rounded-md flex items-center space-x-2 ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <span className="text-sm">{statusMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-md font-medium transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transform hover:scale-105'
                } text-white shadow-lg`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information - Rest of your existing code */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Hyderabad, Telangana<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">talqs262@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Working Hours</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Quick Response</h4>
              <p className="text-green-800 dark:text-green-400 text-sm">
                We typically respond to all inquiries within 24 hours during business days. 
                For urgent matters, please include "URGENT" in your subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
