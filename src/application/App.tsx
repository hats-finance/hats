import { AppRouter, routes } from 'navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'i18n.ts';

function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const language = window.localStorage.getItem('i18nextLng');
    if (language && language !== i18n.language) i18n.changeLanguage(language);
  }, [i18n]);
  
  return <AppRouter routes={routes} />;
}

export default App;
