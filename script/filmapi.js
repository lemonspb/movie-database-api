/* Utilities */

class Observable {
  constructor() {
    this.value = undefined;
    this.callbacks = [];
  }
  onChange(callback) {
    this.callbacks.push(callback);
  }
  set(value) {
    this.value = value;
    this.callbacks.forEach(cb => cb(value));
  }
}

function createElement({ type, classList, attributes, events, children }) {
  const node = document.createElement(type);
  if (classList) {
    node.classList.add(classList);
  }
  if (children) {
    children.forEach(child => node.appendChild(child));
  }
  if (attributes) {
    attributes.forEach(([name, value]) => node.setAttribute(name, value));
  }
  if (events) {
    events.forEach(([name, handler]) => node.addEventListener(name, handler));
  }
  return node;
}

function createTextElement(text) {
  return document.createTextNode(text);
}

const DOM = {
  E: createElement,
  T: createTextElement,
  removeChildren(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  },
};

function requestFilm(url, params, callback) {
  fetch(`${BASE_URL}${url}?${SEARCH_PARAMS}&${params}`).then(async response => {
    if (response.status !== 200) {
      return;
    }
    const data = await response.json();
    callback(data);
  });
}

const API_KEY = "23315c01cb32eba5fcb03d0ad0a1ef43";
const BASE_URL = "https://api.themoviedb.org/3";
const SEARCH_PARAMS = `api_key=${API_KEY}&language=ru`;

const store = {
  films: new Observable(),
  recommendations: new Observable(),
  recommendationsName: new Observable(),
  similar: new Observable(),
  similarName: new Observable(),
  more: new Observable()
};

function addFavorite(id, name, poster, overview, id) {
  const favorites = JSON.parse(localStorage.getItem("storageFilm")) || {};
  favorites[id] = [name, poster, overview,id];
  localStorage.setItem("storageFilm", JSON.stringify(favorites));
}

function removeFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem("storageFilm")) || {};
  delete favorites[id];
  localStorage.setItem("storageFilm", JSON.stringify(favorites));
}

function searchFilm(film) {
  fetch(`${BASE_URL}/search/movie?query=${film}&${SEARCH_PARAMS}`).then(
    async response => {
      if (response.status !== 200) {
        return;
      }
      const moveSearch = document.createElement("h3");
      moveSearch.classList.add("movie-search");
      moveSearch.innerText = `найдено по ${film}`;
      const data = await response.json();
      store.films.set(data.results);
      document.querySelector(".wrapper").appendChild(moveSearch);
    }
  );
}
const wrapper = document.querySelector(".wrapper");
const filmInput = document.querySelector(".film-input");

filmInput.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    searchFilm(filmInput.value);
    paginationVisible("none");
  }
});
document.querySelector(".search-film").addEventListener("click", () => {
  searchFilm(filmInput.value);
  paginationVisible("none");
});

[store.films, store.recommendations, store.similar].forEach(filmsObservable => {
  filmsObservable.onChange(films => {
    const filmListNode = document.createElement("div");
    filmListNode.classList.add("film-list");
    DOM.removeChildren(filmListNode);
    DOM.removeChildren(wrapper);
    wrapper.appendChild(filmListNode);

    films.forEach((film, i) => {
      const filmNode = document.createElement("div");
      filmNode.classList.add("film-item");
      const containerImage = document.createElement("div");
      containerImage.classList.add("container-image");
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      const poster = document.createElement("img");
      poster.classList.add("image");
      poster.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w300/${film.poster_path ||
          "9Tl1O1tfeu8zBh1rSS4lPbJzwTM.jpg"}`
      );
      containerImage.appendChild(poster);
      containerImage.appendChild(overlay);
      const nameFilm = document.createElement("div");
      nameFilm.classList.add("name-film");
      nameFilm.innerText = film.title;
      const releaseDate = document.createElement("div");
      releaseDate.classList.add("release-date");
      releaseDate.innerText =
        "дата выхода: " + film.release_date.slice(0, 4) + " год";

      const rating = document.createElement("div");
      rating.classList.add("rating");
      rating.innerText = "рейтинг: " + film.vote_average;
      const divOverview = document.createElement("div");
      divOverview.classList.add("Overview");
      const h3 = document.createElement("h3");
      h3.innerText = "описание";
      h3.style.color = "tomato ";
      divOverview.innerText = film.overview;

      overlay.appendChild(nameFilm);
      overlay.appendChild(releaseDate);
      overlay.appendChild(rating);
      overlay.appendChild(h3);
      overlay.appendChild(divOverview);

      filmNode.appendChild(containerImage);

      const similarBtn = document.createElement("button");
      similarBtn.innerText = "похожие фильмы";
      filmNode.appendChild(similarBtn);

      const recommendedBtn = document.createElement("button");
      recommendedBtn.innerText = "рекомендации";
      filmNode.appendChild(recommendedBtn);

      const moreBtn = document.createElement("button");
      moreBtn.innerText = "подробнее";
      filmNode.appendChild(moreBtn);

      similarBtn.addEventListener("click", e => {
        requestFilm(`/movie/${film.id}/similar`, undefined, data => {
          store.similar.set(data.results);
          store.similarName.set(film.title);
          paginationVisible("none");
        });
      });

      moreBtn.addEventListener("click", e => {
        requestFilm(
          `/movie/${film.id}`,
          `append_to_response=credits,videos`,
          data => {
            store.more.set(data);
          }
        );
      });
      overlay.addEventListener("click", e => {
        requestFilm(
          `/movie/${film.id}`,
          `append_to_response=credits,videos`,
          data => {
            store.more.set(data);
          }
        );
      });
      recommendedBtn.addEventListener("click", e => {
        requestFilm(`/movie/${film.id}/recommendations`, undefined, data => {
          store.recommendations.set(data.results);
          store.recommendationsName.set(film.title);
          paginationVisible("none");
        });
      });

      filmListNode.appendChild(filmNode);
    });

    scrollDown();
  });
});

store.similarName.onChange(similarName => {
  const titleSimilarName = DOM.E({ type: "div", classList: ["title-similar__name"],
   children: [DOM.T(`фильмы похожие на ${similarName}`)]});
  document.querySelector(".wrapper").appendChild(titleSimilarName);
});
store.recommendationsName.onChange(recommendationsName => {
  const titleRecommendationsName = DOM.E({ type: "div", classList: ["title-recommendations__name"],
  children: [DOM.T(`рекомендации по ${recommendationsName}`)]});
  document.querySelector(".wrapper").appendChild(titleRecommendationsName);
});
