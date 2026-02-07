class Program {
  final int id;
  final String name;
  final String description;
  final String category;
  final String? eligibilityCriteria;
  final String? applicationDeadline;
  final String? contactInfo;
  final String? region;
  final double? latitude;
  final double? longitude;
  final String? language;
  final bool isActive;

  Program({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    this.eligibilityCriteria,
    this.applicationDeadline,
    this.contactInfo,
    this.region,
    this.latitude,
    this.longitude,
    this.language,
    this.isActive = true,
  });

  factory Program.fromJson(Map<String, dynamic> json) {
    return Program(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      category: json['category'] as String,
      eligibilityCriteria: json['eligibilityCriteria'] as String?,
      applicationDeadline: json['applicationDeadline'] as String?,
      contactInfo: json['contactInfo'] as String?,
      region: json['region'] as String?,
      latitude: json['latitude'] as double?,
      longitude: json['longitude'] as double?,
      language: json['language'] as String?,
      isActive: json['isActive'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'category': category,
      'eligibilityCriteria': eligibilityCriteria,
      'applicationDeadline': applicationDeadline,
      'contactInfo': contactInfo,
      'region': region,
      'latitude': latitude,
      'longitude': longitude,
      'language': language,
      'isActive': isActive,
    };
  }
}
