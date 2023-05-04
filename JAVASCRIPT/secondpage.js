"use strict";
//IIfe function 
(function secondpage() {
  const title = document.querySelector("#title");
  title.innerHTML = localStorage.getItem("movieName");
  const year = document.querySelector("#year");
  const movieTime = document.querySelector("#runtime");
  const rating = document.querySelector("#rating");
  const poster = document.querySelector("#poster");
  const plot = document.querySelector("#plot");
  const directorsName = document.querySelector("#director-names");
  const castName = document.querySelector("#cast-names");
  const genre = document.querySelector("#genre");
//fetech the movies
  fetchMovies(title.innerHTML);

  async function fetchMovies(search) {
    //omdbapi 
    const apiurl = `https://www.omdbapi.com/?t=${search}&type=movie&apikey=da3f927`;
    try {
      const response = await fetch(apiurl);
      const data = await response.json();

      year.innerHTML = data.Year;
      movieTime.innerHTML = data.Runtime;
      rating.innerHTML = `${data.imdbRating}/10`;
      poster.setAttribute("src", `${data.Poster}`);
      plot.innerHTML = data.Plot;
      directorsName.innerHTML = data.Director;
      castName.innerHTML = data.Actors;
      genre.innerHTML = data.Genre;
    } 
    catch (err) {
      console.log(err);
    }
  }
})();