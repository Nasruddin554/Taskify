
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, LayoutDashboard, Users, Settings } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Taskify</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm hover:text-primary transition-colors">
            Log in
          </Link>
          <Button asChild>
            <Link to="/auth?register=true">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Manage tasks <span className="text-primary">efficiently</span> with Taskify
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-lg md:mx-0 mx-auto">
              Boost productivity and collaboration with our intuitive task management platform. Track progress, collaborate with your team, and reach your goals faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link to="/auth?register=true">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Log in</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-card border shadow-lg rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800" 
                alt="Task Management Dashboard" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage tasks</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform provides all the tools you need to create, track, and complete tasks efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card border rounded-lg p-6">
            <LayoutDashboard className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Intuitive Dashboard</h3>
            <p className="text-muted-foreground">
              Get a clear overview of all your tasks and projects in one place.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border rounded-lg p-6">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground">
              Work together seamlessly with your team members on shared tasks.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border rounded-lg p-6">
            <Settings className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Customizable Settings</h3>
            <p className="text-muted-foreground">
              Personalize the platform to match your workflow and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What our users say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Thousands of teams use Taskify to improve their productivity and workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card border rounded-lg p-6">
              <p className="mb-4 text-lg italic">
                "Taskify has transformed how our team collaborates on projects. The intuitive interface and powerful features have increased our productivity by 30%."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">
                  JD
                </div>
                <div>
                  <h4 className="font-medium">Jane Doe</h4>
                  <p className="text-sm text-muted-foreground">Project Manager, Tech Co</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card border rounded-lg p-6">
              <p className="mb-4 text-lg italic">
                "The best task management tool we've used. Simple yet powerful. It's become an essential part of our daily workflow."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">
                  JS
                </div>
                <div>
                  <h4 className="font-medium">John Smith</h4>
                  <p className="text-sm text-muted-foreground">Team Lead, Creative Agency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Ready to boost your productivity?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of teams that use Taskify to streamline their workflow and accomplish more.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth?register=true">
              Get Started Free <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Taskify</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Taskify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
