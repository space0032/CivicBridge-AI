import 'package:flutter/material.dart';
import '../models/program.dart';

class ProgramCard extends StatelessWidget {
  final Program program;

  const ProgramCard({Key? key, required this.program}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              program.name,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                program.category,
                style: TextStyle(
                  color: Colors.blue[900],
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              program.description,
              style: TextStyle(
                color: Colors.grey[600],
              ),
            ),
            if (program.region != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.location_on, size: 16),
                  const SizedBox(width: 4),
                  Text(program.region!),
                ],
              ),
            ],
            if (program.applicationDeadline != null) ...[
              const SizedBox(height: 8),
              Text(
                'Deadline: ${program.applicationDeadline}',
                style: const TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () {
                // Navigate to details
              },
              child: const Text('Learn More'),
            ),
          ],
        ),
      ),
    );
  }
}
