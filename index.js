const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const port = 8080;

app.listen(port, () => {
  console.log("Server Started !");
});

app.get("/", (req, res) => {
  res.render("homepage.ejs");
});

app.get("/posts", (req, res) => {
  res.render("posts.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("newPost.ejs");
});

app.post("/posts", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  posts.push({ id, username, content });
  res.redirect("/posts");
});

app.get("/memes", (req, res) => {
  const randomMeme = memes[Math.floor(Math.random() * memes.length)];
  res.render('memes.ejs', { memes: randomMeme });
});

app.get("/songs", (req,res)=>{
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  res.render('songs.ejs', { songs: randomSong });
});

let posts = [
  {
    id: uuidv4(),
    username: "iamasraful",
    content: "I wanna get into MNC's !",
  },

  {
    id: uuidv4(),
    username: "itsraj",
    content: "I am a student",
  },

  {
    id: uuidv4(),
    username: "sanayaray",
    content: "I am new here!",
  },

  {
    id: uuidv4(),
    username: "rohan123",
    content: "Is there any update?",
  },
];

const memes = ['/memes/video1.mp4', '/memes/video2.mp4', '/memes/video3.mp4', '/memes/video4.mp4', '/memes/video5.mp4', '/memes/video6.mp4', '/memes/video7.mp4', '/memes/video8.mp4', '/memes/video9.mp4', '/memes/video10.mp4'];
const songs = ['/songs/s1.m4a', '/songs/s2.m4a', '/songs/s3.m4a', '/songs/s4.m4a', '/songs/s5.m4a', '/songs/s6.m4a', '/songs/s7.m4a', '/songs/s8.m4a', '/songs/s9.m4a', '/songs/s10.m4a', '/songs/s11.m4a', '/songs/s12.m4a', '/songs/s13.m4a', '/songs/s14.m4a', '/songs/s15.m4a'];


