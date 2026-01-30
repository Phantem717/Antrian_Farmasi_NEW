const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Farmasi Queue API',
    version: '1.0.0',
    description: 'API documentation for Antrian Farmasi system',
  },
  host: '192.168.6.106:5000',
  schemes: ['http'],
  tags: [
    { name: 'Pharmacy', description: 'Pharmacy operations' },
    { name: 'Doctor Appointments', description: 'Doctor appointment management' },
    { name: 'Verification', description: 'Verification tasks' },
    { name: 'Medicine', description: 'Medicine task operations' },
    { name: 'Pickup', description: 'Pickup operations' },
        { name: 'Print', description: 'Print operations' },
                { name: 'Responses', description: 'Responses operations' },
                { name: 'WA', description: 'Whats App operations' },
                { name: 'Loket', description: 'Loket operations' },
                { name: 'Logs', description: 'Table Logs operations' },
                { name: 'Login', description: 'Login operations' },
                { name: 'GMCB TEMP', description: 'Temp GMCB operations' },
                { name: 'Get List', description: 'Get List Farmasi operations' },
                { name: 'GMCB', description: 'GMCB operations' },
                { name: 'Button', description: 'Button operations' },
                { name: 'Queue', description: 'Create Queue operations' },
                { name: 'Barcode', description: 'Barcode operations' },
                { name: 'Check', description: 'Check Registration operations' },
                { name: 'Status', description: 'Status operations' },

  ],
};

const outputFile = './swagger-output.json';
// const endpointsFiles = [
//   './server.js', // Your main file that imports routes
//   './routes/*.js', // All route files
// ];
const endpointsFiles = ['./server.js']; // ✅ Your main server file in src/


swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated!');
});