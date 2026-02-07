import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/program.dart';
import '../models/healthcare_facility.dart';

class DatabaseService {
  static Database? _database;
  
  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }
  
  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'civicbridge.db');
    
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }
  
  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE programs(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        eligibilityCriteria TEXT,
        applicationDeadline TEXT,
        contactInfo TEXT,
        region TEXT,
        latitude REAL,
        longitude REAL,
        language TEXT,
        isActive INTEGER DEFAULT 1
      )
    ''');
    
    await db.execute('''
      CREATE TABLE healthcare_facilities(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        services TEXT,
        address TEXT,
        latitude REAL,
        longitude REAL,
        contactNumber TEXT,
        operatingHours TEXT,
        freeServices INTEGER,
        isActive INTEGER DEFAULT 1
      )
    ''');
  }
  
  // Programs CRUD
  Future<void> insertProgram(Program program) async {
    final db = await database;
    await db.insert('programs', program.toJson(),
        conflictAlgorithm: ConflictAlgorithm.replace);
  }
  
  Future<List<Program>> getPrograms() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query('programs');
    return List.generate(maps.length, (i) => Program.fromJson(maps[i]));
  }
  
  Future<void> syncPrograms(List<Program> programs) async {
    final db = await database;
    await db.delete('programs');
    for (var program in programs) {
      await insertProgram(program);
    }
  }
  
  // Healthcare Facilities CRUD
  Future<void> insertHealthcareFacility(HealthcareFacility facility) async {
    final db = await database;
    await db.insert('healthcare_facilities', facility.toJson(),
        conflictAlgorithm: ConflictAlgorithm.replace);
  }
  
  Future<List<HealthcareFacility>> getHealthcareFacilities() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query('healthcare_facilities');
    return List.generate(maps.length, (i) => HealthcareFacility.fromJson(maps[i]));
  }
  
  Future<void> syncHealthcareFacilities(List<HealthcareFacility> facilities) async {
    final db = await database;
    await db.delete('healthcare_facilities');
    for (var facility in facilities) {
      await insertHealthcareFacility(facility);
    }
  }
}
