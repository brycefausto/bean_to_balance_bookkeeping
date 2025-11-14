import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Coffee, Heart, Shield, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-balance mb-6">
            We're brewing success for
            <span className="text-primary"> café owners</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Bean to Balance was born from understanding the unique challenges
            small café owners face in Muntinlupa City. We're here to simplify
            your bookkeeping so you can focus on what matters most.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Target className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To empower small café owners with professional-grade bookkeeping
                tools and expert support, making financial management as smooth
                as the perfect espresso shot.
              </p>
              <p className="text-muted-foreground">
                We believe every café owner deserves access to the same
                financial clarity and professional support that larger
                businesses enjoy, without the complexity or high costs.
              </p>
            </div>
            <Card className="bg-primary/5 border-primary/20 p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    50+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cafés Served
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">3+</div>
                  <div className="text-sm text-muted-foreground">
                    Years Experience
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    15+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expert Bookkeepers
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    99%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Satisfaction Rate
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Heart className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">
                  Café-First Approach
                </h3>
                <p className="text-muted-foreground">
                  We understand the unique rhythms and challenges of café
                  operations, from morning rush to closing time.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">
                  Trust & Transparency
                </h3>
                <p className="text-muted-foreground">
                  Your financial data is sacred. We maintain the highest
                  security standards and complete transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Personal Support</h3>
                <p className="text-muted-foreground">
                  Every café gets dedicated support from certified bookkeepers
                  who know your business personally.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Award className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  We're committed to delivering professional-grade bookkeeping
                  services that exceed expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Coffee className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Local Focus</h3>
                <p className="text-muted-foreground">
                  Born and raised in Muntinlupa, we understand the local
                  business landscape and regulations.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Target className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Growth-Minded</h3>
                <p className="text-muted-foreground">
                  We're not just about managing numbers – we help you understand
                  them to grow your business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Certified professionals passionate about helping café owners succeed
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Maria Santos</h3>
                <p className="text-sm text-primary mb-2">Lead Bookkeeper</p>
                <p className="text-sm text-muted-foreground">
                  CPA with 8+ years specializing in F&B businesses
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Juan Dela Cruz</h3>
                <p className="text-sm text-primary mb-2">Senior Accountant</p>
                <p className="text-sm text-muted-foreground">
                  Tax specialist with deep knowledge of local regulations
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Ana Reyes</h3>
                <p className="text-sm text-primary mb-2">
                  Client Success Manager
                </p>
                <p className="text-sm text-muted-foreground">
                  Former café owner turned business consultant
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to work with us?</h2>
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
