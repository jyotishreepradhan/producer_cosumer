
const fs = require('fs');

// Read the JSON file
fs.readFile('output.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const cookiesData = JSON.parse(data);

    // Calculate net revenue and update the JSON
    for (const cookie of cookiesData) {
      cookie.NetRevenue = cookie['Revenue_Per_Cookie'] - cookie['Cost_Per_Cookie'];
    }

    // Write the updated JSON back to the file
    fs.writeFile('output.json', JSON.stringify(cookiesData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing JSON file:', writeErr);
      } else {
        console.log('JSON file updated with NetRevenue.');
      }
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
