import React from "react";
import Link from "next/link";
import "@/styles/pages/privacy.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-document container">
      <div className="document-section">
        <h1>Privacy Policy - Masr360</h1>
        <div className="metadata">
          <p>
            <strong>Effective Date:</strong> [Insert Date]
          </p>
          <p>
            <strong>Last Updated:</strong> [Insert Date]
          </p>
        </div>

        <h2>1. Introduction</h2>
        <p>
          Welcome to <strong>Masr360</strong>, a smart tourism platform that
          blends culture, technology, and gamified exploration across Egypt.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you visit our website or mobile application.
        </p>
        <p>By using Masr360, you consent to this Privacy Policy.</p>

        <h2>2. Information We Collect</h2>
        <p>
          We collect information to provide better services to our users and
          partners. This may include:
        </p>

        <h3>a. Personal Information</h3>
        <ul className="personal-info-list">
          <li>
            Name, email address, and phone number (for account creation or
            bookings).
          </li>
          <li>
            Payment details (processed securely via third-party providers).
          </li>
          <li>Demographic data (age, country, preferred language).</li>
        </ul>

        <h3>b. Non-Personal Information</h3>
        <ul className="non-personal-info-list">
          <li>Device type, browser, and IP address.</li>
          <li>Usage data, such as pages visited and actions taken.</li>
          <li>Location data (if location access is enabled).</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>Your data helps us to:</p>
        <ul className="usage-list">
          <li>Personalize user experiences and content recommendations.</li>
          <li>Process bookings, payments, and transactions.</li>
          <li>Communicate updates, offers, and customer support.</li>
          <li>Improve platform functionality and fix technical issues.</li>
          <li>
            Analyze user behavior for internal analytics and performance
            tracking.
          </li>
        </ul>

        <h2>4. Sharing of Information</h2>
        <p>Masr360 does not sell or rent your personal data.</p>
        <p>We may share limited data only in the following cases:</p>
        <ul className="sharing-list">
          <li>
            With verified vendors or partners (to complete bookings or
            purchases).
          </li>
          <li>
            With service providers (e.g., payment gateways, analytics tools).
          </li>
          <li>When required by law or governorate authorities.</li>
        </ul>
        <p>
          All partners are required to comply with data protection and
          confidentiality standards.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We use SSL encryption and secure servers to protect your personal
          data.
        </p>
        <p>
          Access to sensitive information is limited to authorized personnel
          only.
        </p>
        <p>
          However, please note that no online transmission is 100% secure, and
          users share information at their own risk.
        </p>

        <h2>6. User Rights</h2>
        <p>You have the right to:</p>
        <ul className="rights-list">
          <li>Access, correct, or delete your personal data.</li>
          <li>Withdraw consent for marketing communication.</li>
          <li>Request details about stored information.</li>
        </ul>
        <p>
          Requests can be made via email:{" "}
          <a href="mailto:privacy@masr360.com">privacy@masr360.com</a>
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We keep your data only as long as necessary for service delivery,
          legal compliance, or business operations.
        </p>
        <p>
          When data is no longer needed, it is securely deleted or anonymized.
        </p>

        <h2>8. Cookies and Tracking Technologies</h2>
        <p>
          Masr360 uses cookies to improve performance and personalize content.
        </p>
        <p>You can manage or disable cookies in your browser settings.</p>
        <p>For details, please review our Cookie Policy.</p>

        <h2>9. Third-Party Links</h2>
        <p>
          Our platform may contain links to third-party websites or vendors.
        </p>
        <p>
          Masr360 is not responsible for their privacy practices, and we
          recommend reviewing their policies separately.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>Masr360 may update this Privacy Policy periodically.</p>
        <p>Updates will be posted with a new "Last Updated" date.</p>
        <p>
          Continued use of the platform after updates means you accept the
          changes.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy, please
          contact us at:
        </p>
        <p>
          <a href="mailto:privacy@masr360.com">privacy@masr360.com</a>
        </p>
        <p>
          <a href="http://www.masr360.com">www.masr360.com</a>
        </p>
      </div>

      {/* Terms & Conditions Section */}
      <div className="document-section">
        <h1>Terms & Conditions (شروط الاستخدام)</h1>
        <div className="metadata">
          <p>
            <strong>Effective Date:</strong> [Insert Date]
          </p>
          <p>
            <strong>Last Updated:</strong> [Insert Date]
          </p>
        </div>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Masr360, a smart tourism platform that helps users explore
          Egypt through interactive experiences, gamified challenges, and
          authentic local products.
        </p>
        <p>
          By accessing or using our website or mobile app, you agree to these
          Terms and Conditions.
        </p>
        <p>If you do not agree, please stop using Masr360 immediately.</p>

        <h2>2. Definitions</h2>
        <ul className="definitions-list">
          <li>
            <strong>"Platform":</strong> The Masr360 website and mobile
            application.
          </li>
          <li>
            <strong>"User":</strong> Any person using Masr360 services.
          </li>
          <li>
            <strong>"Partner" or "Vendor":</strong> Cafés, restaurants,
            artisans, or tour agencies listed on Masr360.
          </li>
          <li>
            <strong>"We", "Us", "Our":</strong> The Masr360 management team.
          </li>
        </ul>

        <h2>3. Use of the Platform</h2>
        <ul className="platform-use-list">
          <li>Users must be at least 13 years old.</li>
          <li>You agree to use Masr360 only for lawful purposes.</li>
          <li>
            You are responsible for maintaining your account and password.
          </li>
          <li>
            Masr360 reserves the right to suspend or terminate any account
            violating these terms.
          </li>
        </ul>

        <h2>4. Services</h2>
        <p>Masr360 provides:</p>
        <ul className="services-list">
          <li>Access to digital tourism content and local experiences.</li>
          <li>Gamified exploration challenges.</li>
          <li>A marketplace for authentic Egyptian handmade products.</li>
        </ul>
        <p>
          Masr360 acts as a digital intermediary and is not directly responsible
          for the services or products provided by third-party vendors.
        </p>

        <h2>5. Payments</h2>
        <ul className="payments-list">
          <li>
            Payments are processed securely via authorized third-party gateways.
          </li>
          <li>Masr360 does not store full payment card details.</li>
          <li>Prices are displayed in USD or EGP.</li>
          <li>
            Users are responsible for ensuring accuracy before confirming a
            purchase.
          </li>
        </ul>

        <h2>6. Refunds and Cancellations</h2>
        <p>
          Refunds follow the Masr360 Refund & Cancellation Policy, available on
          our website.
        </p>

        <h2>7. Partner Listings and Content</h2>
        <ul className="partner-listings-list">
          <li>
            Masr360 may verify, modify, or remove listings violating its
            policies.
          </li>
          <li>
            Vendors are responsible for accuracy and legal compliance of their
            listings.
          </li>
          <li>
            Users must not copy or reuse platform content without consent.
          </li>
        </ul>

        <h2>8. Limitation of Liability</h2>
        <p>Masr360 is not liable for:</p>
        <ul className="liability-list">
          <li>Loss or damage from third-party services.</li>
          <li>Inaccuracies or cancellations by vendors.</li>
          <li>Technical issues beyond control.</li>
        </ul>
        <p>
          Our total liability is limited to the amount paid for the specific
          transaction.
        </p>

        <h2>9. Intellectual Property</h2>
        <p>
          All content (logo, design, text, images, and code) belongs to Masr360.
        </p>
        <p>
          Reproduction or modification without written consent is prohibited.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the Arab Republic of Egypt.
        </p>
        <p>Any disputes will be handled under Egyptian jurisdiction.</p>

        <h2>11. Contact</h2>
        <p>For questions, contact:</p>
        <p>
          <a href="mailto:legal@masr360.com">legal@masr360.com</a>
        </p>
      </div>

      {/* Cookie Policy Section */}
      <div className="document-section">
        <h1>Cookie Policy</h1>
        <div className="metadata">
          <p>
            <strong>Effective Date:</strong> [Insert Date]
          </p>
        </div>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small files stored on your device when visiting Masr360.
        </p>
        <p>They help us improve your experience and remember preferences.</p>

        <h2>2. How We Use Cookies</h2>
        <p>We use cookies to:</p>
        <ul className="cookie-usage-list">
          <li>Keep you logged in and remember settings.</li>
          <li>Analyze traffic with tools like Google Analytics.</li>
          <li>Personalize recommendations and offers.</li>
        </ul>

        <h2>3. Managing Cookies</h2>
        <p>You can disable cookies in your browser settings.</p>
        <p>Disabling cookies may limit some platform features.</p>

        <h2>4. Third-Party Cookies</h2>
        <p>Some cookies come from third parties (e.g., analytics, ads).</p>
        <p>
          Masr360 has no control over these and recommends checking their
          policies.
        </p>

        <h2>5. Policy Updates</h2>
        <p>Masr360 may update this Cookie Policy periodically.</p>
        <p>Please review it regularly for the latest version.</p>
      </div>

      {/* Vendor Agreement Section */}
      <div className="document-section">
        <h1>Vendor Agreement (for Partners & Businesses)</h1>
        <div className="metadata">
          <p>
            <strong>Effective Date:</strong> [Insert Date]
          </p>
          <p>
            <strong>Last Updated:</strong> [Insert Date]
          </p>
        </div>

        <h2>1. Overview</h2>
        <p>
          This Vendor Agreement defines the collaboration between Masr360
          ("Platform") and the Vendor (café, restaurant, artisan, or tour
          operator).
        </p>
        <p>By registering as a Vendor, you agree to these terms.</p>

        <h2>2. Vendor Responsibilities</h2>
        <ul className="vendor-responsibilities-list">
          <li>Provide accurate and current business details.</li>
          <li>Deliver products/services as described.</li>
          <li>Maintain high quality and quick response to customers.</li>
          <li>Follow Egyptian consumer and tax laws.</li>
          <li>Avoid posting illegal or misleading content.</li>
        </ul>

        <h2>3. Masr360 Responsibilities</h2>
        <ul className="masr360-responsibilities-list">
          <li>Promote vendor listings on the platform.</li>
          <li>Manage customer communication and payment processing.</li>
          <li>Offer analytics and visibility through the platform.</li>
        </ul>

        <h2>4. Fees and Commissions</h2>
        <ul className="fees-list">
          <li>Vendors pay annual subscription fees based on category.</li>
          <li>
            Masr360 retains a small commission per transaction or booking.
          </li>
          <li>Settlements occur monthly or as agreed.</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <ul className="vendor-ip-list">
          <li>
            Vendors grant Masr360 permission to use images and logos for
            marketing.
          </li>
          <li>Vendors must ensure all uploaded content respects copyrights.</li>
        </ul>

        <h2>6. Termination</h2>
        <p>Masr360 can suspend or terminate vendor accounts in case of:</p>
        <ul className="termination-list">
          <li>Violations of policies</li>
          <li>Repeated customer complaints</li>
          <li>Fraud or non-payment</li>
        </ul>
        <p>Vendors may also request termination by written notice.</p>

        <h2>7. Liability</h2>
        <p>
          Masr360 is not responsible for delivery delays, damages, or
          vendor-related disputes.
        </p>
        <p>Each vendor operates independently under Egyptian law.</p>

        <h2>8. Confidentiality</h2>
        <p>
          All customer and platform data must remain confidential and used only
          for legitimate purposes.
        </p>

        <h2>9. Governing Law</h2>
        <p>This agreement follows Egyptian law.</p>
        <p>Disputes are settled in Egyptian commercial courts.</p>

        <h2>10. Contact</h2>
        <p>
          <a href="mailto:partners@masr360.com">partners@masr360.com</a>
        </p>
      </div>
    </div>
  );
}
