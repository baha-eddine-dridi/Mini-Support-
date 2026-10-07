import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/api_client.dart';
import '../state/auth_controller.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _isRegister = false;
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _submitting = true; _error = null; });
    try {
      final auth = context.read<AuthController>();
      if (_isRegister) {
        await auth.register(_name.text.trim(), _email.text.trim(), _password.text);
      } else {
        await auth.login(_email.text.trim(), _password.text);
      }
    } on ApiException catch (error) {
      if (mounted) setState(() => _error = error.message);
    } catch (_) {
      if (mounted) setState(() => _error = 'Impossible de contacter le serveur.');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 440),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Icon(Icons.support_agent, size: 56, color: Theme.of(context).colorScheme.primary),
                      const SizedBox(height: 18),
                      Text('Mini Support+', textAlign: TextAlign.center, style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(_isRegister ? 'Créez votre compte utilisateur.' : 'Connectez-vous pour suivre vos tickets.', textAlign: TextAlign.center),
                      const SizedBox(height: 30),
                      if (_isRegister) ...[
                        TextFormField(controller: _name, decoration: const InputDecoration(labelText: 'Nom'), validator: (value) => value == null || value.trim().length < 2 ? '2 caractères minimum' : null),
                        const SizedBox(height: 14),
                      ],
                      TextFormField(controller: _email, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'E-mail'), validator: (value) => value == null || !value.contains('@') ? 'E-mail invalide' : null),
                      const SizedBox(height: 14),
                      TextFormField(controller: _password, obscureText: true, decoration: const InputDecoration(labelText: 'Mot de passe'), validator: (value) => value == null || value.length < 8 ? '8 caractères minimum' : null),
                      if (_error != null) Padding(padding: const EdgeInsets.only(top: 14), child: Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error))),
                      const SizedBox(height: 22),
                      FilledButton(onPressed: _submitting ? null : _submit, child: Padding(padding: const EdgeInsets.all(12), child: Text(_submitting ? 'Chargement…' : _isRegister ? 'Créer mon compte' : 'Se connecter'))),
                      TextButton(onPressed: () => setState(() => _isRegister = !_isRegister), child: Text(_isRegister ? 'Déjà inscrit ? Se connecter' : 'Pas encore de compte ? S’inscrire')),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      );
}

