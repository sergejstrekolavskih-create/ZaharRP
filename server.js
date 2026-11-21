require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cron = require('node-cron');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('RP-Server is active!');
});

// CRON-задача для поддержания активности (пингуем себя каждые 9 минут)
cron.schedule('*/9 * * * *', () => {
  console.log('Keep-alive ping...');
});

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
