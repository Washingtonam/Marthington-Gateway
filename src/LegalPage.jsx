import { Link } from 'react-router-dom';

const CONTENT = {
  disclaimer: {
    title: 'Disclaimer',
    intro: 'This portal is intended to support NIN-related assistance in a responsible and compliant way. Please review the notice below before using the platform.',
    sections: [
      {
        heading: 'Service scope',
        body: 'Marthington Synergy Solutions provides support for NIN-related guidance, document preparation, verification support, and related enquiries. Our services are intended to assist clients with official processes and do not replace any government or NIMC-led procedures.',
      },
      {
        heading: 'Compliance notice',
        body: 'Fresh enrollment and registration requests should be handled through the appropriate official channel and should not be treated as a substitute for physical presence or direct enrollment procedures where required. For fresh registration matters, please speak with our agent on WhatsApp for guidance.',
      },
      {
        heading: 'No refund policy',
        body: 'Once payment has been processed and work has begun, refunds are generally not available unless the service cannot be initiated due to a technical or processing issue beyond the client’s control.',
      },
      {
        heading: 'Accuracy of information',
        body: 'You are responsible for providing accurate and truthful details. Any false, incomplete, or misleading information may cause delays, rejection, or loss of refund eligibility.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'We respect your privacy and are committed to handling your personal information carefully and transparently.',
    sections: [
      {
        heading: 'What we collect',
        body: 'We may collect personal details such as your name, phone number, email address, NIN-related information, and payment details required to process your request.',
      },
      {
        heading: 'How we use your information',
        body: 'Your information is used to process your request, communicate with you, verify your submission, and support the service you selected. We do not share your data with third parties except where required by law or necessary to provide the requested service.',
      },
      {
        heading: 'Data protection',
        body: 'We apply reasonable safeguards to protect your data during collection, storage, and handling. However, no online system is immune to risk, so please ensure that you provide only information you are comfortable sharing.',
      },
      {
        heading: 'Your choices',
        body: 'You may contact us to request clarification about the information we hold or to ask questions about how your data is handled.',
      },
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    intro: 'By using this portal, you agree to the terms below. Please read them carefully before continuing.',
    sections: [
      {
        heading: 'Acceptance of terms',
        body: 'Your use of this website signifies that you accept these terms and conditions. If you do not agree, please stop using the platform.',
      },
      {
        heading: 'User responsibilities',
        body: 'You agree to provide accurate information, use the services voluntarily, and comply with any instructions provided by our support team or the relevant official authority.',
      },
      {
        heading: 'Service limitations',
        body: 'We provide support and guidance, but final decisions, approvals, and official actions remain subject to the applicable authority and its own processes.',
      },
      {
        heading: 'Intellectual property',
        body: 'All content on this website, including text, design, and branding, is the property of Marthington Synergy Solutions unless otherwise stated.',
      },
    ],
  },
};

export default function LegalPage({ page = 'disclaimer' }) {
  const content = CONTENT[page] || CONTENT.disclaimer;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#f0fdf4_100%)] px-4 py-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700">
          ← Back to home
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="flex flex-wrap gap-2">
            {Object.entries(CONTENT).map(([key, item]) => (
              <Link
                key={key}
                to={key === 'disclaimer' ? '/disclaimer' : key === 'privacy' ? '/privacy-policy' : '/terms-and-conditions'}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${page === key ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-900">{content.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">{content.intro}</p>

          <div className="mt-8 space-y-6">
            {content.sections.map((section) => (
              <section key={section.heading} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-bold text-slate-900">{section.heading}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
