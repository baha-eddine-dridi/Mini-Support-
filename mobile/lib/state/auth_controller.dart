import 'package:flutter/foundation.dart';

import '../models/user.dart';
import '../services/api_client.dart';
import '../services/auth_service.dart';

class AuthController extends ChangeNotifier {
  late final ApiClient apiClient = ApiClient(() => _token);
  late final AuthService _authService = AuthService(apiClient);

  bool _isLoading = true;
  String? _token;
  AppUser? _user;

  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null && _user != null;
  AppUser? get user => _user;

  Future<void> restore() async {
    final session = await _authService.restoreSession();
    _token = session?.token;
    _user = session?.user;
    _isLoading = false;
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    final session = await _authService.login(email, password);
    _token = session.token;
    _user = session.user;
    notifyListeners();
  }

  Future<void> register(String name, String email, String password) async {
    final session = await _authService.register(name, email, password);
    _token = session.token;
    _user = session.user;
    notifyListeners();
  }

  Future<void> logout() async {
    await _authService.logout();
    _token = null;
    _user = null;
    notifyListeners();
  }
}

