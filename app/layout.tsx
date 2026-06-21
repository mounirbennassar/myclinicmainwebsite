import type { Metadata } from "next";
import { Manrope, Poppins, Tajawal } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "./i18n/context";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myclinicsa.com.sa"),
  title: "My Clinic | عيادتي — عيادات متخصصة في جدة والرياض",
  description:
    "عيادتي — تجربة رعاية صحية متكاملة وفاخرة. أكثر من 22 تخصصاً طبياً و100 طبيب في جدة والرياض. احجز موعدك الآن 920022811. My Clinic — Premium healthcare with 22+ specialties & 100+ doctors across Jeddah & Riyadh. Book now.",
  openGraph: {
    title: "My Clinic | عيادتي — عيادات متخصصة في جدة والرياض",
    description:
      "تجربة صحية متكاملة وفاخرة — أكثر من 22 تخصصاً طبياً و100 طبيب في جدة والرياض. احجز موعدك الآن 920022811.",
    siteName: "My Clinic | عيادتي",
    images: [
      {
        url: "/myclinic-frame-logo.webp",
        width: 800,
        height: 400,
        alt: "My Clinic | عيادتي",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Clinic | عيادتي — عيادات متخصصة في جدة والرياض",
    description:
      "تجربة صحية متكاملة وفاخرة — أكثر من 22 تخصصاً طبياً و100 طبيب في جدة والرياض. احجز موعدك الآن 920022811.",
    images: ["/myclinic-frame-logo.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${manrope.variable} ${poppins.variable} ${tajawal.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      {/* Google Ads + Google Analytics 4 (shared gtag.js) */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-G0PQZ40KCR" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-G0PQZ40KCR');
        gtag('config', 'AW-18200624514');
      `}</Script>

      {/* Meta (Facebook) Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '2233863943695272');
        fbq('track', 'PageView');
      `}</Script>

      {/* TikTok Pixel */}
      <Script id="tiktok-pixel" strategy="afterInteractive">{`
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
          ttq.load('D1H2LVBC77U195PQP88G');
          ttq.page();
        }(window, document, 'ttq');
      `}</Script>

      {/* Snapchat Pixel */}
      <Script id="snap-pixel" strategy="afterInteractive">{`
        (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
        {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
        a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
        r.src=n;var u=t.getElementsByTagName(s)[0];
        u.parentNode.insertBefore(r,u);})(window,document,
        'https://sc-static.net/scevent.min.js');
        snaptr('init', '2a7506ac-af20-4e9b-a4d1-2139c291d41a', {});
        snaptr('track', 'PAGE_VIEW');
      `}</Script>

      {/* X (Twitter) Pixel */}
      <Script id="x-pixel" strategy="afterInteractive">{`
        !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
        },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
        a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
        twq('config','rbu47');
      `}</Script>

      {/* LinkedIn Insight Tag */}
      <Script id="linkedin-pixel" strategy="afterInteractive">{`
        _linkedin_partner_id = "9937545";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        (function(l) {
          if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
          window.lintrk.q=[]}
          var s = document.getElementsByTagName("script")[0];
          var b = document.createElement("script");
          b.type = "text/javascript";b.async = true;
          b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b, s);
        })(window.lintrk);
      `}</Script>

      <body className="min-h-full flex flex-col font-body bg-surface text-on-surface">
        {/* Meta Pixel noscript fallback */}
        <noscript><img height="1" width="1" style={{display:"none"}} src="https://www.facebook.com/tr?id=2233863943695272&ev=PageView&noscript=1" alt="" /></noscript>
        {/* LinkedIn noscript fallback */}
        <noscript><img height="1" width="1" style={{display:"none"}} alt="" src="https://px.ads.linkedin.com/collect/?pid=9937545&fmt=gif" /></noscript>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
