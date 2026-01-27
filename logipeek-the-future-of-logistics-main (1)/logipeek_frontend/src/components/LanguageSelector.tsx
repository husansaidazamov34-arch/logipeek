import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { i18n, Language } from '@/lib/i18n';

const languages = [
  { code: 'uz' as Language, name: 'O\'zbekcha', flag: '🇺🇿' },
  { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'light';
}

export const LanguageSelector = ({ variant = 'default' }: LanguageSelectorProps) => {
  const [currentLang, setCurrentLang] = useState<Language>(i18n.getLanguage());

  useEffect(() => {
    const unsubscribe = i18n.onLanguageChange(setCurrentLang);
    return unsubscribe;
  }, []);

  const handleLanguageChange = (lang: Language) => {
    i18n.setLanguage(lang);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-2 ${
            variant === 'light' 
              ? 'text-muted-foreground hover:text-foreground hover:bg-muted' 
              : 'text-white hover:text-white hover:bg-white/10'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
          <span className="hidden md:inline">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`gap-2 ${currentLang === language.code ? 'bg-accent' : ''}`}
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};