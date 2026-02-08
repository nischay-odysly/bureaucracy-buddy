import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Button variant="ghost" asChild className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>

        <h1 className="mb-8 text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mb-6 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>When you use Bureaucracy Buddy, we may collect information you provide directly, such as voice recordings, text inputs, and contact information. We also collect usage data including interaction logs and device information to improve our service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use collected information to provide and improve our AI-powered administrative assistance, process your requests, generate documents on your behalf, and communicate with you about our services.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
            <p>Your data is stored securely using industry-standard encryption. Voice recordings are processed in real-time and are not stored permanently unless required for an active conversation session. We implement appropriate technical and organizational measures to protect your personal data.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We may use third-party AI services to process your requests. These services are bound by their own privacy policies and our data processing agreements. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>Under applicable data protection laws (including GDPR), you have the right to access, correct, delete, or export your personal data. You may also object to or restrict certain processing activities. To exercise these rights, contact us at <a href="mailto:nishuastic@gmail.com" className="text-primary hover:underline">nishuastic@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">6. Cookies</h2>
            <p>We use essential cookies to maintain your session and preferences. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">8. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:nishuastic@gmail.com" className="text-primary hover:underline">nishuastic@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
