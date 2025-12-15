import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

const data = {
  facebookLink: '#',
  instaLink: '#',
  twitterLink: '#',
  githubLink: '#',
  dribbbleLink: '#',
  services: {
    detection: '#',
    aiAnalysis: '#',
    weather: '#',
    community: '#',
  },
  about: {
    history: '#',
    team: '#',
    handbook: '#',
    careers: '#',
  },
  help: {
    faqs: '#',
    support: '#',
    livechat: '#',
  },
  contact: {
    email: 'hamasense.app@gmail.com',
    phone: '+62 812-3456-7890',
    address: 'Batam, Kepulauan Riau, Indonesia',
  },
  company: {
    name: 'HAMASENSE',
    description:
      'Asisten cerdas untuk mendeteksi hama tanaman, menganalisis gejala, dan memberi rekomendasi perawatan berbasis AI. Bantu petani dan penghobi merawat tanaman lebih efektif.',
    logo: '/app-logo-green.png',
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: data.facebookLink },
  { icon: Instagram, label: 'Instagram', href: data.instaLink },
  { icon: Twitter, label: 'Twitter', href: data.twitterLink },
  { icon: Github, label: 'GitHub', href: data.githubLink },
  { icon: Dribbble, label: 'Dribbble', href: data.dribbbleLink },
];

const aboutLinks = [
  { text: 'Tentang Kami', href: data.about.history },
  { text: 'Tim Kami', href: data.about.team },
  { text: 'Panduan Pengguna', href: data.about.handbook },
  { text: 'Karier', href: data.about.careers },
];

const serviceLinks = [
  { text: 'Deteksi Hama', href: data.services.detection },
  { text: 'Analisis AI', href: data.services.aiAnalysis },
  { text: 'Prediksi Cuaca', href: data.services.weather },
  { text: 'Komunitas Tani', href: data.services.community },
];

const helpfulLinks = [
  { text: 'FAQ', href: data.help.faqs },
  { text: 'Dukungan', href: data.help.support },
  { text: 'Live Chat', href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer() {
  return (
    <footer className="bg-[#FDFDFC] w-full place-self-end rounded-t-xl border-t border-gray-200">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-primary flex justify-center gap-2 sm:justify-start">
              <img
                src={data.company.logo || '/placeholder.svg'}
                alt="logo"
                className="h-8 w-8 rounded-full"
              />
              <span className="text-2xl font-bold font-logo leading-tight">
                {data.company.name}
              </span>
            </div>

            <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    prefetch={false}
                    href={href}
                    className="text-primary transition hover:text-primary/80"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Tentang Kami</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition hover:text-secondary-foreground"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Layanan</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition hover:text-secondary-foreground"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Bantuan</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`${
                        hasIndicator
                          ? 'group flex justify-center gap-1.5 sm:justify-start'
                          : 'text-secondary-foreground/70 transition hover:text-secondary-foreground'
                      }`}
                    >
                      <span className="text-secondary-foreground/70 transition group-hover:text-secondary-foreground">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative ml-1 flex size-2">
                          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-primary relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Kontak</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li
                    key={text}
                    className="flex items-start justify-center gap-2 sm:justify-start"
                  >
                    <Icon className="text-primary mt-0.5 size-5 shrink-0" />
                    {isAddress ? (
                      <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic">
                        {text}
                      </address>
                    ) : (
                      <span className="text-secondary-foreground/70 flex-1">
                        {text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm">
              <span className="block sm:inline">Hak cipta dilindungi.</span>
            </p>

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
