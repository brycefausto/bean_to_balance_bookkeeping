import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Coffee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-balance mb-6">
            Let's talk about your
            <span className="text-primary"> café's future</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Ready to simplify your bookkeeping? We're here to help you get
            started and answer any questions about how Bean to Balance can
            transform your café's financial management.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24
                  hours
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      First Name
                    </label>
                    <Input placeholder="Juan" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Last Name
                    </label>
                    <Input placeholder="Dela Cruz" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <Input type="email" placeholder="juan@mycafe.com" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Café Name
                  </label>
                  <Input placeholder="My Amazing Café" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Phone Number
                  </label>
                  <Input placeholder="+63 912 345 6789" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    How can we help?
                  </label>
                  <Textarea
                    placeholder="Tell us about your café and what bookkeeping challenges you're facing..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button className="w-full" size="lg">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Visit Our Office</h3>
                      <p className="text-muted-foreground">
                        123 Alabang-Zapote Road
                        <br />
                        Muntinlupa City, Metro Manila 1780
                        <br />
                        Philippines
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Call Us</h3>
                      <p className="text-muted-foreground">
                        +63 (02) 8123-4567
                        <br />
                        +63 912 345 6789
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email Us</h3>
                      <p className="text-muted-foreground">
                        hello@beantobalance.com
                        <br />
                        support@beantobalance.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 8:00 AM - 6:00 PM
                        <br />
                        Saturday: 9:00 AM - 3:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Other ways to get started
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the option that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <MessageCircle className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Get instant answers to your questions from our support team
                </p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Coffee className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Schedule Demo</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  See Bean to Balance in action with a personalized demo
                </p>
                <Button variant="outline" size="sm">
                  Book Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Free Trial</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Try all features free for 30 days, no credit card required
                </p>
                <Button size="sm">Start Trial</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to questions you might have
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                How quickly can I get started?
              </h3>
              <p className="text-muted-foreground">
                You can start your free trial immediately after signing up. Our
                onboarding process takes about 15 minutes, and you'll be
                connected with a bookkeeper within 24 hours.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                Do you work with cafés outside Muntinlupa?
              </h3>
              <p className="text-muted-foreground">
                While we specialize in Muntinlupa cafés, we also serve café
                owners throughout Metro Manila. Contact us to discuss your
                specific location and needs.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                What if I need help setting up?
              </h3>
              <p className="text-muted-foreground">
                We provide full onboarding support including data migration from
                your current system. Our team will guide you through every step
                of the setup process.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to transform your bookkeeping?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join the growing community of successful café owners in Muntinlupa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
