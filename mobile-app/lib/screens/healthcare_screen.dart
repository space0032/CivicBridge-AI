import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/healthcare_facility.dart';
import '../widgets/healthcare_card.dart';
import 'package:geolocator/geolocator.dart';

class HealthcareScreen extends StatefulWidget {
  const HealthcareScreen({Key? key}) : super(key: key);

  @override
  State<HealthcareScreen> createState() => _HealthcareScreenState();
}

class _HealthcareScreenState extends State<HealthcareScreen> {
  final ApiService _apiService = ApiService();
  List<HealthcareFacility> _facilities = [];
  bool _isLoading = true;
  String? _error;
  String _selectedType = '';
  bool _freeServicesOnly = false;

  @override
  void initState() {
    super.initState();
    _loadFacilities();
  }

  Future<void> _loadFacilities() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final facilities = await _apiService.getHealthcareFacilities(
        type: _selectedType.isEmpty ? null : _selectedType,
        freeServices: _freeServicesOnly ? true : null,
      );
      setState(() {
        _facilities = facilities;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _findNearby() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final position = await Geolocator.getCurrentPosition();
      final facilities = await _apiService.getNearbyHealthcare(
        latitude: position.latitude,
        longitude: position.longitude,
      );
      setState(() {
        _facilities = facilities;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Healthcare'),
      ),
      body: Column(
        children: [
          _buildFilters(),
          Expanded(
            child: _buildFacilitiesList(),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.grey[100],
      child: Column(
        children: [
          DropdownButtonFormField<String>(
            value: _selectedType.isEmpty ? null : _selectedType,
            decoration: const InputDecoration(
              labelText: 'Type',
              border: OutlineInputBorder(),
              filled: true,
              fillColor: Colors.white,
            ),
            items: const [
              DropdownMenuItem(value: '', child: Text('All Types')),
              DropdownMenuItem(value: 'HOSPITAL', child: Text('Hospital')),
              DropdownMenuItem(value: 'CLINIC', child: Text('Clinic')),
              DropdownMenuItem(value: 'VACCINATION_CENTER', child: Text('Vaccination Center')),
            ],
            onChanged: (value) {
              setState(() {
                _selectedType = value ?? '';
              });
              _loadFacilities();
            },
          ),
          const SizedBox(height: 8),
          CheckboxListTile(
            title: const Text('Free Services Only'),
            value: _freeServicesOnly,
            onChanged: (value) {
              setState(() {
                _freeServicesOnly = value ?? false;
              });
              _loadFacilities();
            },
          ),
          ElevatedButton.icon(
            onPressed: _findNearby,
            icon: const Icon(Icons.location_on),
            label: const Text('Find Nearby'),
          ),
        ],
      ),
    );
  }

  Widget _buildFacilitiesList() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.red),
            const SizedBox(height: 16),
            Text('Error: $_error'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadFacilities,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_facilities.isEmpty) {
      return const Center(
        child: Text('No healthcare facilities found'),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _facilities.length,
      itemBuilder: (context, index) {
        return HealthcareCard(facility: _facilities[index]);
      },
    );
  }
}
