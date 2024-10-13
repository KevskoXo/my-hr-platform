// index.js

const server = require('./server'); // Importiere den Server aus server.js

const PORT = process.env.PORT_MESSAGE || 5005;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
