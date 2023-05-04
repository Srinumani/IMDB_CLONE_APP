"use strict";
(function () {
  const searchMovie = document.querySelector(".search");
  const movieCardcontainer = document.querySelector(".movieCardContainer");
  const favouriteMovies = document.querySelector(".favouriteMovies");
  const emptyText = document.querySelector("#empty-search-text");
  const viewFavourites = document.querySelector("#favorites-section");
  const emptyFavouriteText = document.querySelector("#empty-fav-text");

  addToDocument();
  showEmptyTextInDocument();
  let emptyList = [];
  let favouriteMovList = [];

  searchMovie.addEventListener("keydown",function(e) {
    if (e.key == "Enter") {
      e.preventDefault();
    }
  });
  // function showEmptyTextInDocument

  function showEmptyTextInDocument() {
    if (favouriteMovies.innerHTML == "") {
      emptyFavouriteText.style.display = "block";
      
    } else {
      emptyFavouriteText.style.display = "none";
    }
  }

  // Event listner
  searchMovie.addEventListener("keyup", function () {
    let search = searchMovie.value;
    if (search === "") {
      emptyText.style.display = "block";
      movieCardcontainer.innerHTML = "";
      notification("Plz Enter MovieName");
      
      // clears the previous movies from list
      emptyList = [];
    } else {
      emptyText.style.display = "none";
      (async function()  {
        let data = await fetchMovies(search);
        addToSuggestionContainerDOM(data);
      })();

      movieCardcontainer.style.display = "grid";
    }
  });

  // Fetches data from omdbapi and calls function to add it in
  async function fetchMovies(search) {
    const apiurl = `https://www.omdbapi.com/?t=${search}&apikey=da3f927`;
    try {
      const response = await fetch(apiurl);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // Shows in suggestion  
  function addToSuggestionContainerDOM(data) {
    document.getElementById("empty-fav-text").style.display = "none";
    let isPresent = false;

    //  check if the movie is already present in the List or not
    emptyList.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    if (!isPresent && data.Title != undefined) {
      if (data.Poster == "N/A") {
        data.Poster = "./images/not-found.png";
      }
      emptyList.push(data);
      const movieCard = document.createElement("div");
      movieCard.setAttribute("class", "text-decoration");

      movieCard.innerHTML = `
        <div class="card my-2" data-id = " ${data.Title} ">
        <a href="secondpage.html" >
          <img
            src="${data.Poster} "
            class="card-img-top"
            alt="${data.Title}"
            data-id = "${data.Title} "
          />
          <div class="card-body text-start">
            <h5 class="card-title" >
              <a href="secondpage.html" data-id = "${data.Title} "> ${data.Title}  </a>
            </h5>

            <p class="card-text">
              <i class="fa-solid fa-star">
                <span id="rating">&nbsp;${data.imdbRating}</span>
              </i>

              <button class="fav-btn">
                <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
              </button>
            </p>
          </div>
        </a>
      </div>
    `;
      movieCardcontainer.prepend(movieCard);
    }
  }

  // Add to favourite  
  async function handleButton(e) {
    const target = e.target;

    let data = await fetchMovies(target.dataset.id);

    let favMoviesLocal = localStorage.getItem("favMoviesList");

    if (favMoviesLocal) {
      favouriteMovList = Array.from(JSON.parse(favMoviesLocal));
      notification("This Movie is Added In Your Favourites Go To Favourites Section See Your Favourites ");
      
    } else {
      localStorage.setItem("favMoviesList", JSON.stringify(data));
    }

    // check if movie is already present in the favourite list pr not
    let isPresent = false;
    favouriteMovList.forEach(function (movie) {
      if (data.Title == movie.Title) {
        notification("This Movie is Already Added To Your Favourites");
        isPresent = true;
      }
    });

    if (!isPresent) {
      favouriteMovList.push(data);
    }

    localStorage.setItem("favMoviesList", JSON.stringify(favouriteMovList));
    isPresent = !isPresent;
    addToDocument();
  }

  // Add to favourite list 
  function addToDocument() {
    favouriteMovies.innerHTML = "";

    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    if (favList) {
      favList.forEach(function (movie) {
        const div = document.createElement("div");
        div.classList.add(
          "fav-movie-card",
          "d-flex",
          "justify-content-between",
          "align-content-center",
          "my-2"
        );
        div.innerHTML = `
   
    <img
      src="${movie.Poster}"
      alt="${movie.Title}"
      class="fav-movie-poster"
    />
    <div class="movie-card-details">
      <p class="movie-name mt-3 mb-0">
       <a href = "secondpage.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}<a> 
      </p>
      <small class="text-muted">${movie.Year}</small>
    </div>

    <div class="delete-btn my-4">
        <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
    </div>
    `;

        favouriteMovies.prepend(div);
      });
    }
  }

  // For notification
  function notification(message) {
    // Create a new element
    const alertBox = document.createElement('div');
    alertBox.setAttribute('class', 'alert alert-success','fade in');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '0px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translate(-50%)';
    alertBox.style.boxShadow='2px 2px 10px green';
    alertBox.style.zIndex='10';
    alertBox.style.width="50%";
    alertBox.style.height="10%";
    alertBox.style.textAlign='center';
    const text = document.createTextNode(message);
    alertBox.appendChild(text);
    document.body.appendChild(alertBox);
    setTimeout(function(){
      alertBox.remove();
    },2000);
    
  }
  
  // Delete from favourite list
  function deleteMovieInFavourites(name) {
    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    let updatedList = Array.from(favList).filter(function (movie) {
      notification("One Item is Successfully Removed From The Favourites");
      
      return movie.Title != name;
    });

    localStorage.setItem("favMoviesList", JSON.stringify(updatedList));

    addToDocument();
    showEmptyTextInDocument();
  }

  // Handle click eventListeners
  async function handleClickListner(event) {
    const target = event.target;

    if (target.classList.contains("add-fav")) {
      event.preventDefault();
      handleButton(event);
    } else if (target.classList.contains("fa-trash-can")) {
      deleteMovieInFavourites(target.dataset.id);
    } else if (target.classList.contains("fa-bars")) {
      if (viewFavourites.style.display == "flex") {
        document.getElementById("show-favourites").style.color = "#8b9595";
        viewFavourites.style.display = "none";
      } else {
        viewFavourites.classList.add("animate__backInRight");
        document.getElementById("show-favourites").style.color =
          "var(--logo-color)";
        viewFavourites.style.display = "flex";
      }
    }

    localStorage.setItem("movieName", target.dataset.id);
  }

  // Event listner on entire page
  document.addEventListener("click", handleClickListner);
})();