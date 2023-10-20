const fs = require('fs');
const xlsx = require('xlsx');

// Load the Excel file
const workbook = xlsx.readFile('Cookie Types.xlsx');

// Assuming the first sheet is the one you want to convert
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON
const jsonData = xlsx.utils.sheet_to_json(worksheet);

// Write the JSON data to a file
fs.writeFileSync('output.json', JSON.stringify(jsonData, null, 2));

console.log('Conversion completed. JSON file created.');
