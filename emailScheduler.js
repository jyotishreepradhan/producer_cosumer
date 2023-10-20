
const schedule = require('node-schedule');
const transporter = require('./sendEmail.js');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const exceljs = require('exceljs');
const fs = require('fs');
const path = require('path');

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/cookieData', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const Cookies = require('./Models/cookie_type');

let configData = require('./config.json')

// // Schedule the email to be sent every day at 1:59 PM
// const emailSchedule = schedule.scheduleJob('59 13 * * *', async () => {
    
const emailSchedule = schedule.scheduleJob(`${configData.shedulerTime.second} ${configData.shedulerTime.minute} ${configData.shedulerTime.hour} ${configData.shedulerTime.dayMonth} ${configData.shedulerTime.month} ${configData.shedulerTime.dayWeek}`, async () => {
  try {
    console.log('Email scheduler started.');

    // Fetch data from MongoDB
    console.log('Fetching data from MongoDB...');
    const data = await Cookies.find().maxTimeMS(30000).exec();
    console.log('Data fetched:', data);

    if (!data || data.length === 0) {
      console.log('No data found in the database.');
      return;
    }

    // Create an Excel workbook and worksheet
    console.log('Creating Excel workbook...');
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Cookie Sales Report');
    
    // Define column headers
    worksheet.columns = [
      { header: 'Cookie Type', key: 'CookieType', width: 15 },
      { header: 'Units Sold', key: 'UnitsSold', width: 15 },
      { header: 'Revenue Per Cookie', key: 'Revenue_Per_Cookie', width: 20 },
      { header: 'Cost Per Cookie', key: 'Cost_Per_Cookie', width: 20 },
      { header: 'Net Revenue', key: 'NetRevenue', width: 15 }
    ];

    // Add data to the worksheet
    console.log('Adding data to Excel worksheet...');
    worksheet.addRows(data);

    // Generate a unique filename for the Excel file
    const excelFileName = `cookie_sales_report_${Date.now()}.xlsx`;
    const excelFilePath = path.join(__dirname, excelFileName);

    // Save the Excel file
    console.log('Saving Excel file...');
    await workbook.xlsx.writeFile(excelFilePath);
    console.log('Excel file saved:', excelFilePath);

    // Set up email data
    console.log('Preparing email...');
    const mailOptions = {
      from: '"Jyotishree pradhan 👻" <jyotishreejp24@gmail.com>',
      to: 'jyotishreejp24@gmail.com,achyutkumar198@gmail.com',
      subject: 'Cookie Sales Report',
      text: 'Please find the attached Excel file containing the Cookie Sales Report.Thank you',
      attachments: [
        {
          filename: excelFileName,
          path: excelFilePath
        }
      ]
    };

    // Send the email
    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    // Delete the temporary Excel file after sending
    console.log('Deleting temporary Excel file...');
    fs.unlinkSync(excelFilePath);
    console.log('Temporary Excel file deleted.');

    console.log('Email scheduler completed.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
