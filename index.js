const { use } = require("express/lib/application");

const express = require("express"),
  morgan = require("morgan"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  Movies = Models.Movie,
  Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

// logs all requests to the terminal
app.use(morgan("common"));

// GET request to get data about all available movies in the database
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// GET - READ data about a list of all avaliable movies
// app.get("/movies", (req, res) => {
//   res.json(movies);
// });

// GET request to get a data about a movie by movieTitle
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// GET - READ data about a movie by title
// app.get("/movies/:title", (req, res) => {
//   // const title = req.params.title;
//   const { title } = req.params;
//   const movie = movies.find((movie) => movie.Title === title);

//   if (movie) {
//     res.status(200).json(movie);
//   } else {
//     res.status(400).send("no such movie");
//   }
// });
// GET request to get data about a genre by genrename
app.get("/movies/genre/:genreName", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// GET - READ data about movie genre
// app.get("/movies/genre/:genreName", (req, res) => {
//   const { genreName } = req.params;
//   const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

//   if (genre) {
//     res.status(200).json(genre);
//   } else {
//     res.status(400).send("no such genre is found!");
//   }
// });

// GET request to get data about a director by directorname
app.get("/movies/director/:directorName", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Get - READ data about a movie by its director name
// app.get("/movies/director/:directorName", (req, res) => {
//   const { directorName } = req.params;
//   const director = movies.find(
//     (movie) => movie.Director.Name === directorName
//   ).Director;

//   if (director) {
//     res.status(200).json(director);
//   } else {
//     res.status(400).send("no such director is found!");
//   }
// });
//POST request to add(register) a new user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// CREATE: register new user
// app.post("/users", (req, res) => {
//   const newUser = req.body;

//   if (newUser.name) {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser);
//   } else {
//     res.status(400).send("users name is required");
//   }
// });

// PUT request to update a user's info by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
//UPDATE: users can update their info(username)
// app.put("/users/:userName", (req, res) => {
//   const { userName } = req.params;
//   const updatedUser = req.body;

//   let user = users.find((user) => user.name == userName);

//   if (user) {
//     user.name = updatedUser.name;
//     res.status(200).json(user);
//   } else {
//     res.status(400).send("user name not found!");
//   }
// });

// GET request to get data about all registred users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET-READ data about a list of all registered users
// app.get("/users", (req, res) => {
//   res.json(users);
// });

// GET request to get data about a user by username
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
//GET - READ data about registered user by name
// app.get("/users/:userName", (req, res) => {
//   const { userName } = req.params;
//   const user = users.find((user) => user.name == userName);

//   if (user) {
//     res.status(200).json(user);
//   } else {
//     res.status(400).send("no such user is found!");
//   }
// });

// POST request to allow user to add a movie to their list of favorites
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
// POST - allow user to add a movie to their list of favorite
// app.post("/users/:name/:movieTitle", (req, res) => {
//   const { name, movieTitle } = req.params;

//   let user = users.find((user) => user.name == name);

//   if (user) {
//     user.favoriteMovies.push(movieTitle);
//     res.status(201).send(`${movieTitle} has been added to ${name}'s favorite`);
//   } else {
//     res.status(400).send("user name not found!");
//   }
// });

// DELETE request to remove a movie from user's favorite list
app.delete("/users/:Username/FavoriteMovies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
// DELTE - allow user to delete a movie from their list of favorite
// app.delete("/users/:userName/:movieTitle", (req, res) => {
//   const { userName, movieTitle } = req.params;

//   let user = users.find((user) => user.name == userName);

//   if (user) {
//     user.favoriteMovies = user.favoriteMovies.filter(
//       (title) => title !== movieTitle
//     );
//     res
//       .status(200)
//       .send(`${movieTitle} has been deleted from ${userName}'s favorite`);
//   } else {
//     res.status(400).send("user not found!");
//   }
// });

// DELETE request to allow existing user to deregister from the database
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// DELETE - allow existing user to deregister from the database
// app.delete("/users/:userName", (req, res) => {
//   const { userName } = req.params;

//   let user = users.find((user) => user.name == userName);

//   if (user) {
//     users = users.filter((user) => user.name != userName);
//     res.status(200).send(`${userName}'s account was succesfully deleted`);
//   } else {
//     res.status(400).send("user not found!");
//   }
// });

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
