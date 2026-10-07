import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config.dart';

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

/// Petite couche HTTP partagée. Le JWT est ajouté seulement aux routes protégées.
class ApiClient {
  ApiClient(this.tokenProvider);

  final String? Function() tokenProvider;

  Future<Map<String, dynamic>> get(String path, {bool protected = true}) async {
    final response = await http.get(_url(path), headers: _headers(protected));
    return _decode(response);
  }

  Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body, {
    bool protected = true,
  }) async {
    final response = await http.post(_url(path), headers: _headers(protected), body: jsonEncode(body));
    return _decode(response);
  }

  Future<Map<String, dynamic>> patch(String path, [Map<String, dynamic>? body]) async {
    final response = await http.patch(_url(path), headers: _headers(true), body: body == null ? null : jsonEncode(body));
    return _decode(response);
  }

  Uri _url(String path) => Uri.parse('$apiUrl$path');

  Map<String, String> _headers(bool protected) {
    final headers = <String, String>{'Content-Type': 'application/json'};
    final token = tokenProvider();
    if (protected && token != null) headers['Authorization'] = 'Bearer $token';
    return headers;
  }

  Map<String, dynamic> _decode(http.Response response) {
    final body = response.body.isEmpty ? <String, dynamic>{} : jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(body['message'] as String? ?? 'Une erreur est survenue.', statusCode: response.statusCode);
    }
    return body;
  }
}

