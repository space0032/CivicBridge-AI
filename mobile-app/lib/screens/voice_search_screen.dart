import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import '../services/api_service.dart';
import 'package:geolocator/geolocator.dart';

class VoiceSearchScreen extends StatefulWidget {
  const VoiceSearchScreen({Key? key}) : super(key: key);

  @override
  State<VoiceSearchScreen> createState() => _VoiceSearchScreenState();
}

class _VoiceSearchScreenState extends State<VoiceSearchScreen> {
  final ApiService _apiService = ApiService();
  final stt.SpeechToText _speech = stt.SpeechToText();
  final FlutterTts _tts = FlutterTts();
  final TextEditingController _queryController = TextEditingController();
  
  bool _isListening = false;
  bool _isLoading = false;
  String _response = '';
  String? _error;

  @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  Future<void> _initSpeech() async {
    await _speech.initialize();
  }

  Future<void> _startListening() async {
    if (!_isListening) {
      bool available = await _speech.initialize();
      if (available) {
        setState(() => _isListening = true);
        _speech.listen(
          onResult: (result) {
            setState(() {
              _queryController.text = result.recognizedWords;
            });
            if (result.finalResult) {
              _processQuery();
            }
          },
        );
      }
    }
  }

  Future<void> _stopListening() async {
    if (_isListening) {
      await _speech.stop();
      setState(() => _isListening = false);
    }
  }

  Future<void> _processQuery() async {
    if (_queryController.text.isEmpty) return;

    setState(() {
      _isLoading = true;
      _error = null;
      _response = '';
    });

    try {
      Position? position;
      try {
        position = await Geolocator.getCurrentPosition();
      } catch (e) {
        print('Location not available');
      }

      final response = await _apiService.processVoiceQuery(
        queryText: _queryController.text,
        language: 'en',
        latitude: position?.latitude,
        longitude: position?.longitude,
        userId: 1,
      );

      setState(() {
        _response = response;
        _isLoading = false;
      });

      // Speak the response
      await _tts.speak(response);
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _speakResponse() async {
    if (_response.isNotEmpty) {
      await _tts.speak(_response);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Voice Search'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Ask questions about programs, healthcare, education, and jobs',
              style: TextStyle(fontSize: 16),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            Center(
              child: GestureDetector(
                onTap: _isListening ? _stopListening : _startListening,
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: _isListening ? Colors.red : Colors.blue,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.5),
                        spreadRadius: 2,
                        blurRadius: 5,
                      ),
                    ],
                  ),
                  child: Icon(
                    _isListening ? Icons.mic_off : Icons.mic,
                    size: 48,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              _isListening ? 'Listening...' : 'Tap to speak',
              style: const TextStyle(fontSize: 18),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            TextField(
              controller: _queryController,
              decoration: const InputDecoration(
                labelText: 'Or type your question',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _isLoading ? null : _processQuery,
              child: Text(_isLoading ? 'Processing...' : 'Ask'),
            ),
            if (_error != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Error: $_error',
                  style: const TextStyle(color: Colors.red),
                ),
              ),
            ],
            if (_response.isNotEmpty) ...[
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Response:',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.volume_up),
                            onPressed: _speakResponse,
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(_response),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 32),
            const Text(
              'Example Questions:',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            _buildExampleQuestion('What government subsidies are available for farmers?'),
            _buildExampleQuestion('Find scholarship programs near me'),
            _buildExampleQuestion('Where can I get free vaccination for my child?'),
            _buildExampleQuestion('What skill training programs are available?'),
          ],
        ),
      ),
    );
  }

  Widget _buildExampleQuestion(String question) {
    return Card(
      child: ListTile(
        title: Text(question),
        onTap: () {
          setState(() {
            _queryController.text = question;
          });
        },
      ),
    );
  }

  @override
  void dispose() {
    _speech.stop();
    _tts.stop();
    _queryController.dispose();
    super.dispose();
  }
}
