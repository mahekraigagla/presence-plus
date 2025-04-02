
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight, MessageSquare, Clock, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message Sent",
      description: "We've received your message and will respond soon.",
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email",
      value: "presenceplus@gmail.com",
      link: "mailto:presenceplus@gmail.com"
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone",
      value: "9833132453",
      link: "tel:9833132453"
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Address",
      value: "Mumbai, Maharashtra, India",
      link: "https://maps.google.com/?q=Mumbai,Maharashtra,India"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Contact Us</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Have questions or feedback? Reach out to our team and we'll get back to you.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="glass dark:glass-dark border-0 shadow-lg p-6 h-full">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                      <p className="text-muted-foreground mb-8">
                        Our dedicated team is ready to answer your questions about Presence+, provide demos, or offer technical support.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      {contactInfo.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <a 
                              href={item.link} 
                              className="text-muted-foreground hover:text-primary transition-colors"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {item.value}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6 border-t border-border">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Operating Hours
                      </h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 2:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-3"
              >
                <Card className="glass dark:glass-dark border-0 shadow-lg p-6 md:p-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
                    <p className="text-muted-foreground mb-6">
                      Fill out the form below and we'll respond as soon as possible.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Your Name
                          </label>
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            required 
                            className="bg-white/50 dark:bg-gray-900/50"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email Address
                          </label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="you@example.com" 
                            required 
                            className="bg-white/50 dark:bg-gray-900/50"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          Subject
                        </label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help you?" 
                          required 
                          className="bg-white/50 dark:bg-gray-900/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          Message
                        </label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us about your inquiry..." 
                          rows={6} 
                          required 
                          className="bg-white/50 dark:bg-gray-900/50 resize-none"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find quick answers to common questions about Presence+
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="card-gradient p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">How accurate is the face recognition?</h3>
                <p className="text-muted-foreground">
                  Our face recognition technology has a 99.8% accuracy rate and includes anti-spoofing measures to prevent impersonation.
                </p>
              </div>
              
              <div className="card-gradient p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Is my facial data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, all biometric data is encrypted and stored securely. We follow strict privacy policies and never share your data.
                </p>
              </div>
              
              <div className="card-gradient p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">What if the system can't recognize me?</h3>
                <p className="text-muted-foreground">
                  If recognition fails, you can try again with better lighting or contact your administrator for alternative verification.
                </p>
              </div>
              
              <div className="card-gradient p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Can teachers edit attendance records?</h3>
                <p className="text-muted-foreground">
                  Yes, teachers have permission to manually edit attendance records when necessary.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Presence+ Attendance System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
