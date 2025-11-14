import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Calculator,
  FileText,
  MessageCircle,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-accent/20 text-accent-foreground border-accent/30">
                ☕ Specially designed for Muntinlupa cafés
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-balance mb-6">
                From bean counting to
                <span className="text-primary"> balanced books</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Professional bookkeeping solutions tailored for small café
                owners. Connect with certified bookkeepers, manage your
                finances, and focus on what you do best – serving great coffee.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                </Button> */}
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent"
                >
                  Book a Demo
                </Button> */}
              </div>
            </div>
            <div className="relative">
              <Card className="bg-primary/5 border-primary/20 p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Monthly Revenue
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      +24%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ₱125,450
                  </div>
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-end justify-center">
                    <BarChart3 className="h-16 w-16 text-primary/60" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">₱45k</div>
                      <div className="text-xs text-muted-foreground">Sales</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">₱28k</div>
                      <div className="text-xs text-muted-foreground">
                        Expenses
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">₱17k</div>
                      <div className="text-xs text-muted-foreground">
                        Profit
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Cafés served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">₱2M+</div>
              <div className="text-muted-foreground">
                Transactions processed
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Certified bookkeepers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <div className="text-muted-foreground">Client satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">
              Everything your café needs for perfect bookkeeping
            </h2>
            <p className="text-xl text-muted-foreground text-pretty">
              From daily transactions to tax-ready reports, we've got you
              covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Financial Records Management
                </h3>
                <p className="text-muted-foreground">
                  Easy daily transaction entry, automatic categorization, and
                  real-time financial tracking
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Professional Bookkeepers
                </h3>
                <p className="text-muted-foreground">
                  Connect with certified bookkeepers who understand the café
                  business
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Smart Dashboard & Reports
                </h3>
                <p className="text-muted-foreground">
                  Real-time insights, profit & loss statements, and tax-ready
                  financial summaries
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Payroll Management
                </h3>
                <p className="text-muted-foreground">
                  Streamlined payroll processing with employee records and
                  automatic calculations
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <MessageCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Direct Communication
                </h3>
                <p className="text-muted-foreground">
                  Built-in messaging system to communicate directly with your
                  assigned bookkeeper
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Bank-Level Security
                </h3>
                <p className="text-muted-foreground">
                  Data encryption, two-factor authentication, and role-based
                  access control
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Ready to balance your books like a pro?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 text-pretty">
            Join 50+ café owners in Muntinlupa who trust Bean to Balance with
            their finances
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial
            </Button> */}
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Schedule a Demo
            </Button> */}
          </div>
        </div>
      </section>
    </>
  );
}
