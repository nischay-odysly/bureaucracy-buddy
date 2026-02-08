import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Button variant="ghost" asChild className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>

        <h1 className="mb-8 text-4xl font-bold text-foreground">Terms of Service</h1>
        <p className="mb-6 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using Bureaucracy Buddy, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>Bureaucracy Buddy is an AI-powered assistant that helps users navigate French administrative processes. Our service includes voice-based interaction, document drafting, phone call assistance, and step-by-step guidance for bureaucratic procedures.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">3. User Responsibilities</h2>
            <p>You are responsible for the accuracy of information you provide. While we strive for accuracy, AI-generated content should be reviewed before submission to any official body. Bureaucracy Buddy is an assistance tool and does not constitute legal advice.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">4. Intellectual Property</h2>
            <p>All content, features, and functionality of Bureaucracy Buddy are owned by us and are protected by international copyright, trademark, and other intellectual property laws. Documents generated for you are yours to use freely.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
            <p>Bureaucracy Buddy is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to errors in generated documents or advice. Always verify important documents with a qualified professional.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">6. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">7. Governing Law</h2>
            <p>These terms are governed by the laws of France. Any disputes shall be resolved in the courts of Paris, France.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">8. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:nishuastic@gmail.com" className="text-primary hover:underline">nishuastic@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
