import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "latest_blogs": "Latest Blogs",
      "trending": "Trending",
      "categories": "Categories",
      "search": "Search articles...",
      "read_more": "Read More",
      "login": "Login",
      "register": "Sign Up",
      "dashboard": "Dashboard",
      "author": "Author",
      "published": "Published",
      "about": "About Us",
      "contact": "Contact"
    }
  },
  hi: {
    translation: {
      "home": "मुख्य पृष्ठ",
      "latest_blogs": "नवीनतम ब्लॉग",
      "trending": "ट्रेंडिंग",
      "categories": "श्रेणियाँ",
      "search": "लेख खोजें...",
      "read_more": "और पढ़ें",
      "login": "लॉगिन",
      "register": "साइन अप",
      "dashboard": "डैशबोर्ड",
      "author": "लेखक",
      "published": "प्रकाशित",
      "about": "हमारे बारे में",
      "contact": "संपर्क करें"
    }
  },
  gu: {
    translation: {
      "home": "મુખ્ય પૃષ્ઠ",
      "latest_blogs": "નવીનતમ બ્લોગ્સ",
      "trending": "ટ્રેન્ડિંગ",
      "categories": "શ્રેણીઓ",
      "search": "લેખ શોધો...",
      "read_more": "વધુ વાંચો",
      "login": "લોગિન",
      "register": "સાઇન અપ",
      "dashboard": "ડેશબોર્ડ",
      "author": "લેખક",
      "published": "પ્રકાશિત",
      "about": "અમારા વિશે",
      "contact": "સંપર્ક કરો"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
