const { use } = require("express/lib/application");

const express = require("express"),
  morgan = require("morgan"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["The Fountain"],
  },
];

let movies = [
  {
    Title: "Don't Look up",
    Director: {
      Name: "Adam McKay",
      Bio: "Adam was born on March 12, 2000 in Berlin. Growing up....",
      Birth: 2000,
    },
    Genre: {
      Name: "Science-Fiction",
      Description: "descpription comes here...blablalbalbal...",
    },
  },
  {
    Title: "Spider-Man: No Way Home",
    Director: {
      Name: "John Watts",
      Bio: "John Watts was born on March 12, 2000 in Berlin. Growing up....",
      Birth: 2000,
    },
    Genre: {
      Name: "Science-Fiction",
      Description: "descrition comes here ..blablalbalbal...",
    },
  },
  {
    Title: "Encanto",
    Director: {
      Name: "Byron Howard",
      Bio: "Byron was born on March 12, 2000 in Berlin. Growing up....",
      Birth: 2000,
    },
    Genre: {
      Name: "Musical fantasy comedy",
      Description: "blablalbalbal...",
    },
  },
  {
    Title: "Harry Potter 20th Anniversary: Return to Hogwarts",
    Director: "Giorgio Testi",
    Genre: {
      Name: "Fantasy",
      Description: "would be explained here..blablalbalbal...",
    },
  },
  {
    Title: "The Matrix Resurrections",
    Director: "Lana Wachowski",
    Genre: {
      Name: "Fantasy",
      Description: "blablalbalbal...",
    },
  },
  {
    Title: "...",
    Director: "...",
    Genre: {
      Name: "...",
      Description: "....",
    },
  },
];

// logs all requests to the terminal
app.use(morgan("common"));

// CREATE: register new user
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("users name is required");
  }
});

//UPDATE: users can update their info(username)
app.put("/users/:userName", (req, res) => {
  const { userName } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.name == userName);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("user name not found!");
  }
});
// POST - allow user to add a movie to their list of favorite
app.post("/users/:name/:movieTitle", (req, res) => {
  const { name, movieTitle } = req.params;

  let user = users.find((user) => user.name == name);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(201).send(`${movieTitle} has been added to ${name}'s favorite`);
  } else {
    res.status(400).send("user name not found!");
  }
});

// DELTE - allow user to delete a movie from their list of favorite
app.delete("/users/:userName/:movieTitle", (req, res) => {
  const { userName, movieTitle } = req.params;

  let user = users.find((user) => user.name == userName);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been deleted from ${userName}'s favorite`);
  } else {
    res.status(400).send("user not found!");
  }
});

// DELETE - allow existing user to deregister from the database
app.delete("/users/:userName", (req, res) => {
  const { userName } = req.params;

  let user = users.find((user) => user.name == userName);

  if (user) {
    users = users.filter((user) => user.name != userName);
    res.status(200).send(`${userName}'s account was succesfully deleted`);
  } else {
    res.status(400).send("user not found!");
  }
});

// GET - READ data about a list of all avaliable movies
app.get("/movies", (req, res) => {
  res.json(movies);
});
//GET-READ data about a list of all registered users
app.get("/users", (req, res) => {
  res.json(users);
});

//GET - READ data about registered user by name
app.get("/users/:userName", (req, res) => {
  const { userName } = req.params;
  const user = users.find((user) => user.name == userName);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user is found!");
  }
});
// GET - READ data about a movie by title
app.get("/movies/:title", (req, res) => {
  // const title = req.params.title;
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});
// GET - READ data about movie genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre is found!");
  }
});
// Get - READ data about a movie by its director name
app.get("/movies/director/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director is found!");
  }
});

// serving static file
app.use(express.static("public"));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Oopss..Something went wrong!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
