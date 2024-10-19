import { createServer, IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

let users: User[] = [];

const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (!url?.startsWith('/api')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'API route not found' }));
    return;
  }
  
  const apiUrl = url.replace('/api', '');
  
  if (method === 'GET' && apiUrl === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
 
  else if (method === 'POST' && apiUrl === '/users') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { username, age, hobbies } = JSON.parse(body);
    
      if (!username || !age || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid data' }));
        return;
      }

      const newUser: User = {
        id: uuidv4(),
        username,
        age,
        hobbies,
      };

      users.push(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  }
  
  else if (method === 'GET' && apiUrl.startsWith('/users/')) {
    const id = apiUrl.split('/')[2];
    const user = users.find((u) => u.id === id);
    
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    }
  }

  else if (method === 'PUT' && apiUrl.startsWith('/users/')) {
    const id = apiUrl.split('/')[2];
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { username, age, hobbies } = JSON.parse(body);
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }
 
      if (!username || !age || !Array.isArray(hobbies)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid data' }));
        return;
      }

      users[userIndex] = { id, username, age, hobbies };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users[userIndex]));
    });
  }

  else if (method === 'DELETE' && apiUrl.startsWith('/users/')) {
    const id = apiUrl.split('/')[2];
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    } else {
      users.splice(userIndex, 1);
      res.writeHead(204); 
      res.end();
    }
  }
  
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};

const server = createServer(handleRequest);

server.listen(4000, () => {
  console.log('Server running at http://localhost:4000/api/');
});
