import { createServer } from 'http';

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'CRUD API is running...' }));
});

server.listen(4000, () => {
  console.log('Server running at http://localhost:4000/');
});
