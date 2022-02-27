const http = require("http");
const express = require("express");
const { application } = require("express");
const app = express();
const logger = require('./loggerMiddleware')
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(logger)

let notes = [
  {
    id: 1,
    content: "Me tengo que suscribir a @midudev en YouTube",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
        id: 2,
    content: "Me tengo que suscribir a @midudev sen Twitch",
    date: "2026-05-30T17:30:31.098Z",
    important: false,
  },
  {
    id: 3,
    content: "Javascript Mola",
    date: "2005-05-30T17:30:31.098Z",
    important: true,
  },
];
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hola mundete</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  console.log(note);
  console.log(id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id != id);
  response.status(204).end();
});
app.post("/api/notes", (request, response) => {
  const note = request.body;
  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  if (!note || !note.content) {
    return response.status(400).json({
      error: "Some content is missing...",
    });
  }
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important === "boolean" ? note.important : false,
    date: new Date().toISOString(),
  };

  notes = [...notes, newNote];

  response.status(201).json(newNote);
});

app.use((request,response) =>{
  // console.log(request.path)
  // Esto podría ser interesante por ejemplo para ver que ruta nos está llevando a este error...
response.status(404).json({
  error :'Not found'
})
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
