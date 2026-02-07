import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/program.dart';
import '../models/healthcare_facility.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8080/api';
  
  // Programs API
  Future<List<Program>> getPrograms({String? category, String? region}) async {
    final queryParams = <String, String>{};
    if (category != null) queryParams['category'] = category;
    if (region != null) queryParams['region'] = region;
    
    final uri = Uri.parse('$baseUrl/programs').replace(queryParameters: queryParams);
    final response = await http.get(uri);
    
    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final List<dynamic> programsJson = data['data'] as List<dynamic>;
      return programsJson.map((json) => Program.fromJson(json as Map<String, dynamic>)).toList();
    } else {
      throw Exception('Failed to load programs');
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
    final response = await http.get(uri);
    
    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final List<dynamic> facilitiesJson = data['data'] as List<dynamic>;
      return facilitiesJson.map((json) => HealthcareFacility.fromJson(json as Map<String, dynamic>)).toList();
    } else {
      throw Exception('Failed to load healthcare facilities');
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
    
    final response = await http.get(uri);
    
    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final List<dynamic> facilitiesJson = data['data'] as List<dynamic>;
      return facilitiesJson.map((json) => HealthcareFacility.fromJson(json as Map<String, dynamic>)).toList();
    } else {
      throw Exception('Failed to load nearby healthcare facilities');
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
    );
    
    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      return data['data'] as String;
    } else {
      throw Exception('Failed to process voice query');
    }
  }
}
