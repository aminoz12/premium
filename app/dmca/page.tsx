import PageShell from '../_components/PageShell';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'WATCHWORLDCUP DMCA Policy & Copyright Takedowns',
  description:
    'DMCA copyright notification and takedown policy for WATCHWORLDCUP. How rights holders can report alleged copyright infringements.',
  path: '/dmca',
});

export default function Page() {
  return (
    <PageShell
      eyebrow="Legal · Effective 11 August 2026"
      title="DMCA Copyright & Takedown Policy"
      description="WATCHWORLDCUP respects intellectual property rights and handles copyright notifications in accordance with applicable laws."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'DMCA Policy' },
      ]}
    >
      <div className="prose-copy max-w-4xl space-y-8">
        <section>
          <h2>Overview & Policy Statement</h2>
          <p className="mt-4">
            WATCHWORLDCUP (watchworldcup.us) respects the intellectual property rights of copyright holders and content creators. It is our policy to respond promptly to valid notices of alleged copyright infringement in compliance with the Digital Millennium Copyright Act (DMCA) and international copyright standards.
          </p>
        </section>

        <section>
          <h2>Non-Affiliation Notice</h2>
          <p className="mt-4">
            WATCHWORLDCUP is an independent entity. WATCHWORLDCUP does not host, store, or stream audio/video media directly on its web servers. This site presents time-based service information, setup guidance, and open data archives regarding sports and World Cup history.
          </p>
        </section>

        <section>
          <h2>Submitting a DMCA Takedown Notice</h2>
          <p className="mt-4">
            If you are a copyright owner (or an authorized representative) and believe that material residing on or accessible through watchworldcup.us infringes your copyright, please send a written notification containing the following information:
          </p>
          <ul className="mt-4 list-disc pl-6 space-y-2 text-slate-300">
            <li>
              A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
            </li>
            <li>
              Identification of the copyrighted work claimed to have been infringed, or a representative list of such works.
            </li>
            <li>
              Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, with information reasonably sufficient to locate the material (URL or page reference).
            </li>
            <li>
              Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email address.
            </li>
            <li>
              A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
            </li>
            <li>
              A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
            </li>
          </ul>
        </section>

        <section>
          <h2>Designated Contact Point</h2>
          <p className="mt-4">
            Please submit all DMCA notices and copyright inquiries to our designated contact email or via our official contact channels:
          </p>
          <p className="mt-2 font-bold text-white">
            Email: <a href="mailto:dmca@watchworldcup.us" className="text-red-400 hover:underline">dmca@watchworldcup.us</a> / <a href="mailto:support@watchworldcup.us" className="text-red-400 hover:underline">support@watchworldcup.us</a>
          </p>
        </section>

        <section>
          <h2>Counter-Notification Procedure</h2>
          <p className="mt-4">
            If material you posted was removed or disabled due to a copyright notice and you believe this was done in error or misidentification, you may submit a written counter-notification containing required legal statements to our contact point.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
