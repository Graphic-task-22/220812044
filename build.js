const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 确保dist目录存在
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// 构建每个作业
const assignments = ['assignment1', 'assignment2', 'assignment3', 'assignment4'];

assignments.forEach(assignment => {
  console.log(`Building ${assignment}...`);
  exec(`cd ${assignment} && npm run build`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error building ${assignment}:`, error);
      return;
    }
    console.log(`Successfully built ${assignment}`);
  });
}); 