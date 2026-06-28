import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "settings": "Settings",
      "language": "Language",
      "theme": "Theme",
      "export_data": "Export Account Data",
      "export_desc": "Download all your resumes and portfolio data as JSON.",
      "export_btn": "Export Data"
    }
  },
  es: {
    translation: {
      "settings": "Ajustes",
      "language": "Idioma",
      "theme": "Tema",
      "export_data": "Exportar datos",
      "export_desc": "Descarga todos tus currículums y datos en JSON.",
      "export_btn": "Exportar"
    }
  },
  hi: {
    translation: {
      "settings": "सेटिंग्स",
      "language": "भाषा",
      "theme": "थीम",
      "export_data": "खाता डेटा निर्यात करें",
      "export_desc": "अपना सारा डेटा JSON के रूप में डाउनलोड करें।",
      "export_btn": "निर्यात करें"
    }
  },
  fr: {
    translation: {
      "settings": "Paramètres",
      "language": "Langue",
      "theme": "Thème",
      "export_data": "Exporter les données",
      "export_desc": "Téléchargez toutes vos données au format JSON.",
      "export_btn": "Exporter"
    }
  },
  de: {
    translation: {
      "settings": "Einstellungen",
      "language": "Sprache",
      "theme": "Thema",
      "export_data": "Daten exportieren",
      "export_desc": "Laden Sie alle Ihre Daten als JSON herunter.",
      "export_btn": "Exportieren"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
