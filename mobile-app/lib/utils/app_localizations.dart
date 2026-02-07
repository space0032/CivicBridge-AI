import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'welcome': 'Welcome to CivicBridge AI',
      'programs': 'Programs',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'employment': 'Employment',
      'voice_search': 'Voice Search',
      'search': 'Search',
      'nearby': 'Nearby',
      'filter': 'Filter',
      'all_categories': 'All Categories',
      'free_services': 'Free Services',
      'find_nearby': 'Find Nearby',
    },
    'es': {
      'welcome': 'Bienvenido a CivicBridge AI',
      'programs': 'Programas',
      'healthcare': 'Salud',
      'education': 'Educación',
      'employment': 'Empleo',
      'voice_search': 'Búsqueda por voz',
      'search': 'Buscar',
      'nearby': 'Cercano',
      'filter': 'Filtrar',
      'all_categories': 'Todas las categorías',
      'free_services': 'Servicios gratuitos',
      'find_nearby': 'Encontrar cercanos',
    },
    'hi': {
      'welcome': 'CivicBridge AI में आपका स्वागत है',
      'programs': 'कार्यक्रम',
      'healthcare': 'स्वास्थ्य सेवा',
      'education': 'शिक्षा',
      'employment': 'रोजगार',
      'voice_search': 'आवाज खोज',
      'search': 'खोज',
      'nearby': 'निकटवर्ती',
      'filter': 'फ़िल्टर',
      'all_categories': 'सभी श्रेणियां',
      'free_services': 'मुफ्त सेवाएं',
      'find_nearby': 'पास खोजें',
    },
  };

  String translate(String key) {
    return _localizedValues[locale.languageCode]?[key] ?? key;
  }
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'es', 'hi'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
