import PageShell from '../_components/PageShell';
import { pageMetadata } from '@/lib/seo';
import { WHATSAPP_PHONE_DISPLAY } from '@/lib/cta';

export const metadata = pageMetadata({
  title: 'WATCHWORLDCUP Refund & Cancellation Policy',
  description:
    'Refund, cancellation, and trial policy for WATCHWORLDCUP IPTV subscriptions and WhatsApp orders.',
  path: '/refund-policy',
});

export default function Page() {
  return (
    <PageShell
      eyebrow="Commercial Policy · Effective 11 August 2026"
      title="Refund & Cancellation Policy"
      description="Clear terms governing order verification, plan cancellations, refunds, and support inquiries."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Refund Policy' },
      ]}
    >
      <div className="prose-copy max-w-4xl space-y-8">
        <section>
          <h2>Pre-Order Verification & Test Period</h2>
          <p className="mt-4">
            At WATCHWORLDCUP, we require all prospective customers to confirm content requirements, device model, operating system, and application compatibility on WhatsApp ({WHATSAPP_PHONE_DISPLAY}) before completing payment.
          </p>
          <p className="mt-4">
            We offer guidance and test periods prior to purchase so you can verify that your device, network, and application function as expected before committing to a paid multi-month subscription plan.
          </p>
        </section>

        <section>
          <h2>Refund Eligibility Criteria</h2>
          <p className="mt-4">
            Refund requests are reviewed on a case-by-case basis according to the following guidelines:
          </p>
          <ul className="mt-4 list-disc pl-6 space-y-2 text-slate-300">
            <li>
              <strong>Activation Failure:</strong> If subscription credentials cannot be delivered or activated within 24 hours of confirmed payment due to a service fault, a full refund will be granted upon request.
            </li>
            <li>
              <strong>Major Technical Non-Delivery:</strong> If a technical issue prevents access immediately post-activation and our support team cannot resolve it within 48 hours, a pro-rata refund may be issued.
            </li>
            <li>
              <strong>Pre-Activation Cancellation:</strong> Orders cancelled before activation credentials have been generated and dispatched are eligible for a full refund.
            </li>
          </ul>
        </section>

        <section>
          <h2>Non-Refundable Circumstances</h2>
          <p className="mt-4">
            Refunds will not be issued in the following circumstances:
          </p>
          <ul className="mt-4 list-disc pl-6 space-y-2 text-slate-300">
            <li>
              Incompatibility of third-party hardware, devices, or applications that were not disclosed or confirmed prior to purchase.
            </li>
            <li>
              Local internet service provider (ISP) throttling, local network outages, or device-side configuration issues outside our control.
            </li>
            <li>
              Changes to individual third-party channel lineups or temporary event broadcasts.
            </li>
            <li>
              Violation of usage terms, such as unauthorized reselling, sharing credentials across unapproved IP locations, or public distribution of private playlist links.
            </li>
          </ul>
        </section>

        <section>
          <h2>How to Request a Refund or Cancellation</h2>
          <p className="mt-4">
            To submit a refund or cancellation inquiry, contact our support team on WhatsApp at {WHATSAPP_PHONE_DISPLAY} or email <a href="mailto:support@watchworldcup.us" className="text-red-400 hover:underline">support@watchworldcup.us</a> with your order details and a description of the issue.
          </p>
          <p className="mt-4">
            Approved refunds will be processed via the original payment method or a mutually agreed alternative within 3 to 7 business days.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
