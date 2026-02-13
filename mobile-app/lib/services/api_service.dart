import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;
import '../models/program.dart';
import '../models/healthcare_facility.dart';

class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException(this.message, this.statusCode);

  @override
  String toString() => 'ApiException: $message (Status: $statusCode)';
}

class ApiService {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL', 
    defaultValue: 'http://localhost:8080/api'
  );
  
  static const int maxRetries = 3;

  Future<http.Response> _getWithRetry(Uri uri) async {
    int attempts = 0;
    while (attempts < maxRetries) {
      try {
        final response = await http.get(uri).timeout(const Duration(seconds: 10));
        return response;
      } on Exception catch (e) {
        attempts++;
        if (attempts >= maxRetries) rethrow;
        await Future.delayed(Duration(seconds: attempts * 2));
      }
    }
    throw Exception('Failed after $maxRetries retries');
  }

  dynamic _processResponse(http.Response response) {
    final Map<String, dynamic> data = json.decode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data['data'];
    } else {
      final String message = data['message'] ?? 'Unexpected error occurred';
      throw ApiException(message, response.statusCode);
    }
  }

  // Programs API
  Future<List<Program>> getPrograms({String? category, String? region}) async {
    final queryParams = <String, String>{};
    if (category != null) queryParams['category'] = category;
    if (region != null) queryParams['region'] = region;
    
    final uri = Uri.parse('$baseUrl/programs').replace(queryParameters: queryParams);
    
    try {
      final response = await _getWithRetry(uri);
      final List<dynamic> programsJson = _processResponse(response) as List<dynamic>;
      return programsJson.map((json) => Program.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      if (e is ApiException) rethrow;
      throw Exception('Failed to load programs: $e');
    }
  }
  
  // Healthcare API
  Future<List<HealthcareFacility>> getHealthcareFacilities({
    String? type,
    bool? freeServices,
  }) async {
    final queryParams = <String, String>{};
    if (type != null) queryParams['type'] = type;
    if (freeServices != null) queryParams['freeServices'] = freeServices.toString();
    
    final uri = Uri.parse('$baseUrl/healthcare').replace(queryParameters: queryParams);
    
    try {
      final response = await _getWithRetry(uri);
      final List<dynamic> facilitiesJson = _processResponse(response) as List<dynamic>;
      return facilitiesJson.map((json) => HealthcareFacility.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      if (e is ApiException) rethrow;
      throw Exception('Failed to load healthcare facilities: $e');
    }
  }
  
  Future<List<HealthcareFacility>> getNearbyHealthcare({
    required double latitude,
    required double longitude,
    double radiusKm = 10.0,
  }) async {
    final uri = Uri.parse('$baseUrl/healthcare/nearby').replace(
      queryParameters: {
        'latitude': latitude.toString(),
        'longitude': longitude.toString(),
        'radiusKm': radiusKm.toString(),
      },
    );
    
    try {
      final response = await _getWithRetry(uri);
      final List<dynamic> facilitiesJson = _processResponse(response) as List<dynamic>;
      return facilitiesJson.map((json) => HealthcareFacility.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      if (e is ApiException) rethrow;
      throw Exception('Failed to load nearby healthcare facilities: $e');
    }
  }
  
  // Voice Query API
  Future<String> processVoiceQuery({
    required String queryText,
    String language = 'en',
    double? latitude,
    double? longitude,
    int? userId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/voice-query'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'queryText': queryText,
          'language': language,
          'latitude': latitude,
          'longitude': longitude,
          'userId': userId,
        }),
      ).timeout(const Duration(seconds: 15));
      
      return _processResponse(response) as String;
    } catch (e) {
      if (e is ApiException) rethrow;
      throw Exception('Failed to process voice query: $e');
    }
  }
}
