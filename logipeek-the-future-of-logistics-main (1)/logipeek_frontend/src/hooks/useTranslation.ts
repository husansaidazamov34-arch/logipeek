import { useState, useEffect } from 'react';
import { i18n, Language, TranslationKey } from '@/lib/i18n';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.getLanguage());

  useEffect(() => {
    const unsubscribe = i18n.onLanguageChange(setCurrentLanguage);
    return unsubscribe;
  }, []);

  const t = (key: TranslationKey): string => {
    return i18n.t(key);
  };

  return {
    t,
    language: currentLanguage,
    setLanguage: i18n.setLanguage.bind(i18n),
  };
};