db = db.getSiblingDB('test');

// Create collections
db.createCollection('students');
db.createCollection('professors');
db.createCollection('admins');
db.createCollection('subjects');
db.createCollection('feedbackforms');
db.createCollection('feedbackresponses');

// Create indexes
db.students.createIndex({ "username": 1 }, { unique: true });
db.professors.createIndex({ "username": 1 }, { unique: true });
db.admins.createIndex({ "username": 1 }, { unique: true });
db.subjects.createIndex({ "subjectCode": 1 }, { unique: true });
db.feedbackforms.createIndex({ "name": 1 }, { unique: true }); 