class HealthcareFacility {
  final int id;
  final String name;
  final String type;
  final String? services;
  final String? address;
  final double? latitude;
  final double? longitude;
  final String? contactNumber;
  final String? operatingHours;
  final bool? freeServices;
  final bool isActive;

  HealthcareFacility({
    required this.id,
    required this.name,
    required this.type,
    this.services,
    this.address,
    this.latitude,
    this.longitude,
    this.contactNumber,
    this.operatingHours,
    this.freeServices,
    this.isActive = true,
  });

  factory HealthcareFacility.fromJson(Map<String, dynamic> json) {
    return HealthcareFacility(
      id: json['id'] as int,
      name: json['name'] as String,
      type: json['type'] as String,
      services: json['services'] as String?,
      address: json['address'] as String?,
      latitude: json['latitude'] as double?,
      longitude: json['longitude'] as double?,
      contactNumber: json['contactNumber'] as String?,
      operatingHours: json['operatingHours'] as String?,
      freeServices: json['freeServices'] as bool?,
      isActive: json['isActive'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'services': services,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'contactNumber': contactNumber,
      'operatingHours': operatingHours,
      'freeServices': freeServices,
      'isActive': isActive,
    };
  }
}
