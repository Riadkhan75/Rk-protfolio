import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToSettings, subscribeToSkills } from '../lib/firebase';

type Language = 'EN' | 'BN';

const defaultTranslations = {
  EN: {
    hero_access: "ACCESS GRANTED",
    hero_title: "NEON_HACKER",
    hero_portfolio: "ENTER PORTFOLIO",
    hero_cv: "DOWNLOAD CV",
    hero_hire: "HIRE FOR ME",
    about_title: "BIO_ENCRYPTION_STREAM",
    projects_title: "NEURAL_NODES",
    skills_title: "TECH_PROTOCOLS",
    contact_title: "ESTABLISH_UPLINK",
    contact_name: "Identity_Alias",
    contact_email: "Secure_Protocol",
    contact_message: "Encoded_Payload",
    contact_submit: "START_UPLINK",
  },
  BN: {
    hero_access: "এক্সেস অনুমোদিত",
    hero_title: "নিয়ন_হ্যাকার",
    hero_portfolio: "পোর্টফোলিও প্রবেশ করুন",
    hero_cv: "সিভি ডাউনলোড",
    hero_hire: "আমাকে নিয়োগ দিন",
    about_title: "জীবনী_এনক্রিপশন_স্ট্রিম",
    projects_title: "নিউরল_নোডস",
    skills_title: "প্রযুক্তি_প্রোটোকল",
    contact_title: "লিংক_স্থাপন_করুন",
    contact_name: "পরিচয়_নাম",
    contact_email: "নিরাপদ_প্রোটোকল",
    contact_message: "পেলোড_মেসেজ",
    contact_submit: "আপলিংক_শুরু",
  }
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: keyof typeof defaultTranslations.EN) => string;
}>({
  lang: 'EN',
  setLang: () => {},
  t: () => '',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'EN');
  const [dynamicTranslations, setDynamicTranslations] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    const unsub = subscribeToSettings((settings) => {
      if (settings) {
        const dynamicContent = {
          EN: {
            hero_title: settings.heroTitle_EN || defaultTranslations.EN.hero_title,
            hero_access: settings.heroAccess_EN || defaultTranslations.EN.hero_access,
            about_title: settings.aboutTitle_EN || defaultTranslations.EN.about_title,
            projects_title: settings.projectsTitle_EN || defaultTranslations.EN.projects_title,
            skills_title: settings.skillsTitle_EN || defaultTranslations.EN.skills_title,
            contact_title: settings.contactTitle_EN || defaultTranslations.EN.contact_title,
          },
          BN: {
            hero_title: settings.heroTitle_BN || defaultTranslations.BN.hero_title,
            hero_access: settings.heroAccess_BN || defaultTranslations.BN.hero_access,
            about_title: settings.aboutTitle_BN || defaultTranslations.BN.about_title,
            projects_title: settings.projectsTitle_BN || defaultTranslations.BN.projects_title,
            skills_title: settings.skillsTitle_BN || defaultTranslations.BN.skills_title,
            contact_title: settings.contactTitle_BN || defaultTranslations.BN.contact_title,
          }
        };
        setDynamicTranslations(dynamicContent);
      }
    });

    return () => unsub();
  }, []);

  const t = (key: keyof typeof defaultTranslations.EN) => {
    if (dynamicTranslations && dynamicTranslations[lang] && dynamicTranslations[lang][key]) {
      return dynamicTranslations[lang][key];
    }
    return defaultTranslations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

// Global Settings Context for Matrix Effect
const SettingsContext = createContext<{
  matrixEnabled: boolean;
  setMatrixEnabled: (v: boolean) => void;
  neonMode: boolean;
  setNeonMode: (v: boolean) => void;
  maintenanceMode: boolean;
  siteTitle: string;
  introTitle: string;
  introSubtitle: string;
  audioOnText: string;
  audioOffText: string;
  navLinks: { name: string; href: string; isExternal?: boolean }[];
  secondaryLinks: { name: string; href: string; isExternal?: boolean }[];
  footerText: string;
  aboutText_EN: string;
  aboutText_BN: string;
  adminName: string;
  adminRole: string;
  adminLocation: string;
  adminExperience: string;
  profileImage: string;
  ambientMusicUrl: string;
  currentlyCoding: string;
  bgText: string;
  primaryColor: string;
  matrixSpeed: number;
  fontStyle: string;
  metaDescription: string;
  metaKeywords: string;
  ogpImage: string;
  vaultPassword: string;
  skills: any[];
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
}>({
  matrixEnabled: false,
  setMatrixEnabled: () => {},
  neonMode: true,
  setNeonMode: () => {},
  maintenanceMode: false,
  siteTitle: 'NEON_HACKER',
  introTitle: 'NEON_HACKER',
  introSubtitle: 'SYSTEM_BOOT_V2.0.9',
  audioOnText: 'AI_ON',
  audioOffText: 'AI_OFF',
  navLinks: [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'SKILLS', href: '/skills' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CHALLENGES', href: '/challenges' },
    { name: 'SOCIALS', href: '/socials' },
    { name: 'CONTACT', href: '/contact' },
  ],
  secondaryLinks: [],
  footerText: '© 2026_NEON_GRID_SYSTEMS',
  aboutText_EN: '',
  aboutText_BN: '',
  adminName: 'NEON_HACKER',
  adminRole: 'SYSTEMS ARCHITECT',
  adminLocation: 'NEO_TOKYO_GRID',
  adminExperience: '7+ CYCLES',
  profileImage: '',
  ambientMusicUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
  currentlyCoding: 'Portfolio_V3.tsx',
  bgText: 'Rk Hacker',
  primaryColor: '#00f3ff',
  matrixSpeed: 0.75,
  fontStyle: 'Inter',
  metaDescription: 'Tech Portfolio of a Neon Cyberpunk Developer',
  metaKeywords: 'developer, cyberpunk, portfolio',
  ogpImage: '',
  vaultPassword: '',
  skills: [],
  isMenuOpen: false,
  setIsMenuOpen: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [neonMode, setNeonMode] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [siteTitle, setSiteTitle] = useState('NEON_HACKER');
  const [introTitle, setIntroTitle] = useState('NEON_HACKER');
  const [introSubtitle, setIntroSubtitle] = useState('SYSTEM_BOOT_V2.0.9');
  const [audioOnText, setAudioOnText] = useState('AI_ON');
  const [audioOffText, setAudioOffText] = useState('AI_OFF');
  const [navLinks, setNavLinks] = useState<{ name: string; href: string; isExternal?: boolean }[]>([
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'SKILLS', href: '/skills' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CHALLENGES', href: '/challenges' },
    { name: 'SOCIALS', href: '/socials' },
    { name: 'CONTACT', href: '/contact' },
  ]);
  const [secondaryLinks, setSecondaryLinks] = useState<{ name: string; href: string; isExternal?: boolean }[]>([]);
  const [footerText, setFooterText] = useState('© 2026_NEON_GRID_SYSTEMS');
  const [aboutText_EN, setAboutText_EN] = useState('');
  const [aboutText_BN, setAboutText_BN] = useState('');
  const [adminName, setAdminName] = useState('NEON_HACKER');
  const [adminRole, setAdminRole] = useState('SYSTEMS ARCHITECT');
  const [adminLocation, setAdminLocation] = useState('NEO_TOKYO_GRID');
  const [adminExperience, setAdminExperience] = useState('7+ CYCLES');
  const [profileImage, setProfileImage] = useState('');
  const [ambientMusicUrl, setAmbientMusicUrl] = useState('https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3');
  const [currentlyCoding, setCurrentlyCoding] = useState('Portfolio_V3.tsx');
  const [bgText, setBgText] = useState('Rk Hacker');
  const [primaryColor, setPrimaryColor] = useState('#00f3ff');
  const [matrixSpeed, setMatrixSpeed] = useState(0.75);
  const [fontStyle, setFontStyle] = useState('Inter');
  const [metaDescription, setMetaDescription] = useState('Tech Portfolio of a Neon Cyberpunk Developer');
  const [metaKeywords, setMetaKeywords] = useState('developer, cyberpunk, portfolio');
  const [ogpImage, setOgpImage] = useState('');
  const [vaultPassword, setVaultPassword] = useState('');
  const [skills, setSkills] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSettings((settings) => {
      if (settings) {
        if (typeof settings.maintenanceMode === 'boolean') setMaintenanceMode(settings.maintenanceMode);
        setSiteTitle(settings.siteTitle || 'NEON_HACKER');
        setIntroTitle(settings.introTitle || 'NEON_HACKER');
        setIntroSubtitle(settings.introSubtitle || 'SYSTEM_BOOT_V2.0.9');
        setAudioOnText(settings.audioOnText || 'AI_ON');
        setAudioOffText(settings.audioOffText || 'AI_OFF');
        if (settings.navLinks && Array.isArray(settings.navLinks)) {
          setNavLinks(settings.navLinks);
        }
        if (settings.secondaryLinks && Array.isArray(settings.secondaryLinks)) {
          setSecondaryLinks(settings.secondaryLinks);
        }
        setFooterText(settings.footerText || '© 2026_NEON_GRID_SYSTEMS');
        setAboutText_EN(settings.aboutText_EN || '');
        setAboutText_BN(settings.aboutText_BN || '');
        setAdminName(settings.adminName || 'NEON_HACKER');
        setAdminRole(settings.adminRole || 'SYSTEMS ARCHITECT');
        setAdminLocation(settings.adminLocation || 'NEO_TOKYO_GRID');
        setAdminExperience(settings.adminExperience || '7+ CYCLES');
        setProfileImage(settings.profileImage || '');
        setAmbientMusicUrl(settings.ambientMusicUrl || 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3');
        setCurrentlyCoding(settings.currentlyCoding || 'Portfolio_V3.tsx');
        setBgText(settings.bgText || 'Rk Hacker');
        setPrimaryColor(settings.primaryColor || '#00f3ff');
        setMatrixSpeed(settings.matrixSpeed || 0.75);
        setFontStyle(settings.fontStyle || 'Inter');
        setMetaDescription(settings.metaDescription || 'Tech Portfolio of a Neon Cyberpunk Developer');
        setMetaKeywords(settings.metaKeywords || 'developer, cyberpunk, portfolio');
        setOgpImage(settings.ogpImage || '');
        setVaultPassword(settings.vaultPassword || '');
      }
    });

    const unsubSkills = subscribeToSkills((data) => {
      setSkills(data);
    });

    return () => {
      unsub();
      unsubSkills();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      matrixEnabled, 
      setMatrixEnabled, 
      neonMode, 
      setNeonMode,
      maintenanceMode,
      siteTitle,
      introTitle,
      introSubtitle,
      audioOnText,
      audioOffText,
      navLinks,
      secondaryLinks,
      footerText,
      aboutText_EN,
      aboutText_BN,
      adminName,
      adminRole,
      adminLocation,
      adminExperience,
      profileImage,
      ambientMusicUrl,
      currentlyCoding,
      bgText,
      primaryColor,
      matrixSpeed,
      fontStyle,
      metaDescription,
      metaKeywords,
      ogpImage,
      vaultPassword,
      skills,
      isMenuOpen,
      setIsMenuOpen
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
