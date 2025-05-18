import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, LayoutGrid, Users, Clock, MessageSquare } from 'lucide-react';
const LandingPage: React.FC = () => {
  return <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors">
      {/* Navigation */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2">
                <img src="/lovable-uploads/13d60c81-dde3-4f3d-a4ee-6c5bc6231383.png" alt="SynergySphere Logo" className="w-full h-full" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                SynergySphere
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">Testimonials</a>
              
              <a href="#faq" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">FAQ</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                  Elevate Your Team's Performance
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                SynergySphere is the ultimate collaboration tool, helping you stay organized,
                communicate better, and make informed decisions without friction.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">Get Started Free</Button>
                </Link>
                <Link to="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-30"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&h=600&q=80" alt="SynergySphere Dashboard" className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 dark:bg-gray-800 transition-colors py-[54px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything Your Team Needs</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              SynergySphere provides powerful tools to help your team stay organized, communicate effectively, and deliver projects on time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:shadow-lg">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <LayoutGrid className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Project Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create, update, and track projects with ease. Add project details, images, and assign team members.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:shadow-lg">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Work together seamlessly with real-time updates and project-specific communication channels.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:shadow-lg">
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Task Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create, assign, and track tasks for each project. Set due dates and monitor progress in real-time.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 transition-all hover:shadow-lg">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Responsive Design</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access your projects and tasks from any device with our fully responsive platform.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/register">
              
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform How Your Team Works?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using SynergySphere to collaborate better and deliver faster.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-2">
                  <img src="/lovable-uploads/13d60c81-dde3-4f3d-a4ee-6c5bc6231383.png" alt="SynergySphere Logo" className="w-full h-full" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                  SynergySphere
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The ultimate collaboration tool for teams of all sizes.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} SynergySphere. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;