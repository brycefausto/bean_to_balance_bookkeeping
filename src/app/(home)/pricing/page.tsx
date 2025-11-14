import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Check, MessageCircle, Star, Users } from "lucide-react";

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-balance mb-6">
            Simple pricing for
            <span className="text-primary"> every café</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Choose the plan that fits your café's needs. All plans include our
            core bookkeeping features and dedicated support from certified
            professionals.
          </p>
          <Badge className="mb-8 bg-accent/20 text-accent-foreground border-accent/30">
            ☕ 30-day free trial • No setup fees • Cancel anytime
          </Badge>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Starter</CardTitle>
                <p className="text-muted-foreground mb-4">
                  Perfect for new cafés getting started
                </p>
                <div className="text-4xl font-bold text-primary mb-2">
                  ₱2,500
                </div>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Up to 200 transactions/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Basic financial reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Invoice generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Monthly bookkeeper consultation</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Professional</CardTitle>
                <p className="text-muted-foreground mb-4">
                  Ideal for established cafés
                </p>
                <div className="text-4xl font-bold text-primary mb-2">
                  ₱4,500
                </div>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Up to 500 transactions/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Advanced financial reports & analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Payroll management (up to 5 employees)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Dedicated bookkeeper</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Priority support & messaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Tax preparation assistance</span>
                  </li>
                </ul>
                <Button className="w-full">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                <p className="text-muted-foreground mb-4">
                  For multiple locations or high-volume cafés
                </p>
                <div className="text-4xl font-bold text-primary mb-2">
                  ₱7,500
                </div>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Unlimited transactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Multi-location management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Unlimited payroll management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Senior bookkeeper & CPA access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>24/7 priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All plans include</h2>
            <p className="text-lg text-muted-foreground">
              Core features that every café needs for successful bookkeeping
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <BarChart3 className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">
                  Real-time Dashboard
                </h3>
                <p className="text-muted-foreground text-sm">
                  Monitor your café's financial health with live updates and
                  insights
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
                <p className="text-muted-foreground text-sm">
                  Access to certified bookkeepers who understand café operations
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <MessageCircle className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">
                  Direct Communication
                </h3>
                <p className="text-muted-foreground text-sm">
                  Built-in messaging to communicate directly with your
                  bookkeeper
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect at the start of your next billing cycle.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                What happens during the free trial?
              </h3>
              <p className="text-muted-foreground">
                You get full access to all features of your chosen plan for 30
                days. No credit card required to start, and you can cancel
                anytime.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                Do you offer discounts for annual payments?
              </h3>
              <p className="text-muted-foreground">
                Yes! Pay annually and save 15% on any plan. Contact our sales
                team for more details about annual pricing.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                What if I exceed my transaction limit?
              </h3>
              <p className="text-muted-foreground">
                We'll notify you when you're approaching your limit. You can
                either upgrade your plan or pay a small fee for additional
                transactions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join 50+ café owners who trust Bean to Balance with their finances
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
