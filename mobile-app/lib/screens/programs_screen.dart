import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/program.dart';
import '../widgets/program_card.dart';

class ProgramsScreen extends StatefulWidget {
  const ProgramsScreen({Key? key}) : super(key: key);

  @override
  State<ProgramsScreen> createState() => _ProgramsScreenState();
}

class _ProgramsScreenState extends State<ProgramsScreen> {
  final ApiService _apiService = ApiService();
  List<Program> _programs = [];
  bool _isLoading = true;
  String? _error;
  String _selectedCategory = '';

  @override
  void initState() {
    super.initState();
    _loadPrograms();
  }

  Future<void> _loadPrograms() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final programs = await _apiService.getPrograms(
        category: _selectedCategory.isEmpty ? null : _selectedCategory,
      );
      setState(() {
        _programs = programs;
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
        title: const Text('Programs'),
      ),
      body: Column(
        children: [
          _buildFilters(),
          Expanded(
            child: _buildProgramsList(),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.grey[100],
      child: DropdownButtonFormField<String>(
        value: _selectedCategory.isEmpty ? null : _selectedCategory,
        decoration: const InputDecoration(
          labelText: 'Category',
          border: OutlineInputBorder(),
          filled: true,
          fillColor: Colors.white,
        ),
        items: const [
          DropdownMenuItem(value: '', child: Text('All Categories')),
          DropdownMenuItem(value: 'HEALTHCARE', child: Text('Healthcare')),
          DropdownMenuItem(value: 'EDUCATION', child: Text('Education')),
          DropdownMenuItem(value: 'AGRICULTURE', child: Text('Agriculture')),
          DropdownMenuItem(value: 'EMPLOYMENT', child: Text('Employment')),
        ],
        onChanged: (value) {
          setState(() {
            _selectedCategory = value ?? '';
          });
          _loadPrograms();
        },
      ),
    );
  }

  Widget _buildProgramsList() {
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
              onPressed: _loadPrograms,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_programs.isEmpty) {
      return const Center(
        child: Text('No programs found'),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _programs.length,
      itemBuilder: (context, index) {
        return ProgramCard(program: _programs[index]);
      },
    );
  }
}
