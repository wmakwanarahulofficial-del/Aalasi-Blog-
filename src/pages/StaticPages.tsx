import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>About Us | Aalasi Blog</title>
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-wider">About Aalasi Blog</h1>
        <div className="prose prose-lg prose-indigo text-gray-700">
          <p className="lead text-xl text-gray-600 font-medium mb-8">
            Aalasi Blog is a premium multi-language platform dedicated to bringing you the highly curated insights on Technology, Business, and Lifestyle.
          </p>
          <p className="mb-6">
            Founded with the vision to bridge the knowledge gap across multiple languages including English, Hindi, and Gujarati. We believe that language should never be a barrier to high-quality information.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Mission</h2>
          <p className="mb-6">
            To provide an AI-ready, scalable, and beautifully designed magazine platform that content creators can use to engage deeply with non-English speaking and global audiences alike.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>Contact Us | Aalasi Blog</title>
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-wider">Get in Touch</h1>
          <p className="text-lg text-gray-600 mb-10">
            Have questions about our affiliate programs, sponsored posts, or advertising opportunities? Reach out to our team.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email Us</h3>
                <p className="text-gray-600">hello@aalasi.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Call Us</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Address</h3>
                <p className="text-gray-600">Innovation Ave, Tech City</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" required></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-600/30">
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
