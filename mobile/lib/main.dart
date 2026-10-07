import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'screens/auth_screen.dart';
import 'screens/dashboard_screen.dart';
import 'state/auth_controller.dart';

void main() => runApp(const MiniSupportApp());

class MiniSupportApp extends StatelessWidget {
  const MiniSupportApp({super.key});

  @override
  Widget build(BuildContext context) => ChangeNotifierProvider(
        create: (_) => AuthController()..restore(),
        child: MaterialApp(
          title: 'Mini Support+',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0F8E82)),
            inputDecorationTheme: const InputDecorationTheme(border: OutlineInputBorder()),
          ),
          home: const _AppGate(),
        ),
      );
}

class _AppGate extends StatelessWidget {
  const _AppGate();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    if (auth.isLoading) return const Material(child: Center(child: CircularProgressIndicator()));
    return auth.isAuthenticated ? const DashboardScreen() : const AuthScreen();
  }
}

