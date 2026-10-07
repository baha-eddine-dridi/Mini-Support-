import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';
import 'api_client.dart';

class AuthService {
  AuthService(this._api);

  final ApiClient _api;
  static const _tokenKey = 'mini-support-token';
  static const _userKey = 'mini-support-user';

  Future<Session?> restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    final rawUser = prefs.getString(_userKey);
    if (token == null || rawUser == null) return null;
    return Session(token: token, user: AppUser.fromJson(jsonDecode(rawUser) as Map<String, dynamic>));
  }

  Future<Session> login(String email, String password) async {
    final data = await _api.post('/auth/login', {'email': email, 'password': password}, protected: false);
    return _saveSession(data);
  }

  Future<Session> register(String name, String email, String password) async {
    final data = await _api.post('/auth/register', {'name': name, 'email': email, 'password': password}, protected: false);
    return _saveSession(data);
  }

  Future<Session> _saveSession(Map<String, dynamic> data) async {
    final user = AppUser.fromJson(data['user'] as Map<String, dynamic>);
    final token = data['token'] as String;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_userKey, jsonEncode(user.toJson()));
    return Session(token: token, user: user);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }
}

class Session {
  const Session({required this.token, required this.user});
  final String token;
  final AppUser user;
}

