import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

export default function TermsOfService() {
  const content = `<p><strong>Terms of Service</strong></p><p><strong>Effective Date: 1<sup>st</sup> March 2026</strong></p><p>Welcome to DataSentry (<a href="http://www.datasentry.in" target="_blank">www.datasentry.in</a>). By accessing or using this website, you agree to be bound by these Terms of Service.</p><p><strong>1. Use of Website</strong></p><p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others.</p><p><strong>You shall not:</strong></p><ul><li>Submit false, misleading, or unauthorized information </li><li>Attempt to gain unauthorized access to the website or its systems </li><li>Use this website for any unlawful or fraudulent activity </li></ul><p><strong>2. Nature of Services</strong></p><p>DataSentry provides consulting and advisory services in areas including information security, data privacy, and compliance.</p><p><strong>Any information provided on this website is for general informational purposes only and does not constitute professional or legal advice unless formally agreed through a signed engagement.</strong></p><p><strong>3. User Submissions (Contact Form)</strong></p><p>By submitting information through the website:</p><p><strong>You confirm that:</strong></p><ul><li>The information provided is accurate and lawful </li><li>You have the right to share such information </li></ul><p><strong>You agree that:</strong></p><ul><li>DataSentry may use this information to respond to your query and provide relevant services </li><li>Your submission does not create a contractual relationship </li></ul><p><strong>4. Privacy and Data Protection</strong></p><p>Your use of this website is also governed by our Privacy Policy.</p><p><strong>DataSentry processes personal data in accordance with the Digital Personal Data Protection Act, 2023.</strong></p><p><strong>5. Intellectual Property</strong></p><p>All content on this website, including text, graphics, logos, and materials, is the property of DataSentry unless otherwise stated.</p><p><strong>You may not reproduce, distribute, or use any content without prior written consent.</strong></p><p><strong>6. Third-Party Links</strong></p><p>This website may contain links to third-party websites.</p><p><strong>We are not responsible for the content, privacy practices, or terms of such external websites.</strong></p><p><strong>7. Limitation of Liability</strong></p><p><strong>To the maximum extent permitted by law, DataSentry shall not be liable for:</strong></p><ul><li>Any direct, indirect, incidental, or consequential damages arising from use of this website </li><li>Reliance on any information provided on the website </li></ul><p><strong>8. Disclaimer</strong></p><p>The website is provided on an "as-is" basis without warranties of any kind, express or implied.</p><p><strong>9. Indemnity</strong></p><p>You agree to indemnify and hold harmless DataSentry from any claims, damages, or losses arising from your misuse of the website or violation of these Terms.</p><p><strong>10. Governing Law</strong></p><p>These Terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mumbai, India.</p><p><strong>11. Changes to Terms</strong></p><p>We may update these Terms from time to time.</p><p><strong>Continued use of the website constitutes acceptance of the updated Terms.</strong></p><p><strong>12. Contact Information</strong></p><p>For any questions contact us at <a href="mailto:enquiry@datasentry.in">enquiry@datasentry.in</a>.</p>`;

  return (
    <>
      <Navbar />
      <Breadcrumb items={[{ label: 'Terms of Service' }]} />
      <main className="bg-background-light min-h-screen pb-20">
        <header className="bg-background-dark text-white py-16 md:py-24 border-b-[3px] border-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-block bg-primary text-black px-3 py-1 font-mono text-xs font-bold uppercase mb-6 border border-black shadow-[2px_2px_0px_0px_white]">
              Legal Information
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">Terms of Service</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-10 md:p-16">
            <div 
              className="font-mono text-sm md:text-base text-gray-800 leading-relaxed space-y-6 [&_strong]:text-black [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-6 [&_p:has(strong)]:mt-10 [&_p:has(strong)]:text-xl [&_p:has(strong)]:font-display [&_a]:text-secondary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
