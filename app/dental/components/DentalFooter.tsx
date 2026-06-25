"use client";
import Image from "next/image";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick } from "@/app/lib/tracking";

export default function DentalFooter() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  return (
    <footer className="w-full py-12 border-t border-slate-200/50 bg-slate-50 px-4 md:px-0">
      <div className="max-w-7xl mx-auto md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <Image src="/logo-dark.svg" alt="My Clinic" width={150} height={40} className="h-10 w-auto" />
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-slate-500 hover:text-[#003867] transition-colors text-sm font-medium" href="/contact">
              {isRtl ? "تواصل معنا" : "Contact"}
            </a>
            <a className="text-slate-500 hover:text-[#003867] transition-colors text-sm font-medium" href="/privacy-policy">
              {isRtl ? "الخصوصية" : "Privacy"}
            </a>
            <a className="text-slate-500 hover:text-[#003867] transition-colors text-sm font-medium" href="/terms">
              {isRtl ? "الشروط والأحكام" : "Terms"}
            </a>
          </div>
        </div>

        {/* Contact channels */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 mb-8">
          <a href="tel:920022811" onClick={trackPhoneClick} className="flex items-center gap-2 text-slate-600 hover:text-[#003867] transition-colors text-sm font-bold" dir="ltr">
            <span className="material-symbols-outlined text-[18px]">call</span>
            920 022 811
          </a>
          <span className="hidden sm:block w-px h-4 bg-slate-300" aria-hidden />
          <a href="mailto:info@myclinic.com.sa" className="flex items-center gap-2 text-slate-600 hover:text-[#003867] transition-colors text-sm font-bold" dir="ltr">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            info@myclinic.com.sa
          </a>
        </div>

        {/* App Store Badges */}
        <div className="flex justify-center gap-4 mb-8">
          <a href="https://apps.apple.com/us/app/my-clinic-ksa/id1475630623?ign-itscg=30200&ign-itsct=apps_box_badge" target="_blank" rel="noopener noreferrer">
            <Image src="/Download_on_the_App_Store.png" alt="Download on the App Store" width={135} height={40} className="h-10 w-auto" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.myclinic.ksa&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1" target="_blank" rel="noopener noreferrer">
            <Image src="/Get_it_on_playstore.png" alt="Get it on Google Play" width={135} height={40} className="h-10 w-auto" />
          </a>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-sm font-bold text-[#003867] uppercase tracking-widest">
            {isRtl ? "تابع عيادتي" : "Follow My Clinic"}
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://www.instagram.com/myclinicksa/", icon: "fa-instagram", label: "Instagram" },
              { href: "https://www.tiktok.com/@myclinic_ksa", icon: "fa-tiktok", label: "TikTok" },
              { href: "https://www.linkedin.com/company/myclinicksa/", icon: "fa-linkedin-in", label: "LinkedIn" },
              { href: "https://www.facebook.com/MyClinicKSA/", icon: "fa-facebook-f", label: "Facebook" },
              { href: "https://www.youtube.com/channel/UCzD7SKMrFnKCZywENykDPCA", icon: "fa-youtube", label: "YouTube" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 hover:bg-[#003867] hover:text-white transition-colors"
                aria-label={s.label}
                title={s.label}
              >
                <i className={`fa-brands ${s.icon} text-base`}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center pt-6 border-t border-slate-200/50">
          <p className="text-sm text-slate-500">
            &copy; {isRtl ? "2026 عيادتي. جميع الحقوق محفوظة." : "2026 My Clinic. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
