import InquiryForm from "@/components/InquiryForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Chiang Mai Estates",
  description: "Get in touch with our team of real estate experts in Chiang Mai.",
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or rent, our team of local experts is here to assist you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-3xl border border-primary-100 dark:border-primary-800">
              <h3 className="text-2xl font-bold text-foreground mb-6">Our Office</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-accent-500 shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Location</h4>
                    <p className="text-foreground/70">123 Nimmanahaeminda Road<br/>Suthep, Mueang Chiang Mai<br/>Chiang Mai 50200, Thailand</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-accent-500 shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Phone</h4>
                    <p className="text-foreground/70">+66 (0) 53-123-456<br/>+66 (0) 81-987-6543 (Mobile/WhatsApp)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-accent-500 shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <p className="text-foreground/70">sawadee@chiangmaiestates.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-accent-500 shadow-sm">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Business Hours</h4>
                    <p className="text-foreground/70">Monday - Friday: 9:00 AM - 6:00 PM<br/>Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-primary-900/10 p-8 rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-100 dark:border-primary-800/50">
            <h3 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h3>
            <InquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
