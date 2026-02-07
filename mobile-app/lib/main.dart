import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'screens/programs_screen.dart';
import 'screens/healthcare_screen.dart';
import 'screens/voice_search_screen.dart';
import 'services/language_service.dart';
import 'utils/app_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase for push notifications
  // await Firebase.initializeApp();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LanguageService()),
      ],
      child: const CivicBridgeApp(),
    ),
  );
}

class CivicBridgeApp extends StatelessWidget {
  const CivicBridgeApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageService>(
      builder: (context, languageService, child) {
        return MaterialApp(
          title: 'CivicBridge AI',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            primarySwatch: Colors.blue,
            visualDensity: VisualDensity.adaptivePlatformDensity,
            fontFamily: 'Roboto',
          ),
          locale: languageService.currentLocale,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            // Add other delegates as needed
          ],
          supportedLocales: const [
            Locale('en', 'US'),
            Locale('es', 'ES'),
            Locale('hi', 'IN'),
          ],
          home: const HomeScreen(),
          routes: {
            '/home': (context) => const HomeScreen(),
            '/programs': (context) => const ProgramsScreen(),
            '/healthcare': (context) => const HealthcareScreen(),
            '/voice-search': (context) => const VoiceSearchScreen(),
          },
        );
      },
    );
  }
}
