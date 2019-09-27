function differentMovieSearch(request, title, page) {
  fetch(`${BASE_URL}/movie/${request}?${SEARCH_PARAMS}&page=${page}`).then(
    async response => {
      if (response.status !== 200) {
        return;
      }

      const data = await response.json();
      const moveTitile = document.createElement("h3");
      moveTitile.classList.add("movie-title");
      moveTitile.innerText = title;

      store.films.set(data.results);
      document.querySelector(".wrapper").appendChild(moveTitile);
    }
  );
}

document.querySelector(".item-icon.upcoming").addEventListener("click", () => {
  document.documentElement.scrollTop = 400;
  differentMovieSearch("upcoming", "Скоро в кино", 1);
  paginationVisible("flex");
});
document
  .querySelector(".item-icon.now_playing")
  .addEventListener("click", () => {
    differentMovieSearch("now_playing", "Сейчас в кино");
    paginationVisible("flex");
  });

document.querySelector(".item-icon.popular").addEventListener("click", () => {
  differentMovieSearch("popular", "Популярные сейчас", 1);
  paginationVisible("flex");
});

document.querySelectorAll(".page-item").forEach(paginator => {
  paginator.addEventListener("click", e => {
    const title = document.querySelector(".movie-title");
    console.log(title.innerText);
    if (title.innerText === "Популярные сейчас") {
      differentMovieSearch("popular", "Популярные сейчас", e.target.innerText);
    }
    if (title.innerText === "Скоро в кино") {
      differentMovieSearch("upcoming", "Скоро в кино", e.target.innerText);
    }
    if (title.innerText === "Сейчас в кино") {
      differentMovieSearch("now_playing", "Сейчас в кино", e.target.innerText);
    }
  });
});

function paginationVisible(visible) {
  document.querySelector(".page-pagination").style.display = visible;
}

document.querySelector(".your-best").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "block";
  const bestFilmList = JSON.parse(localStorage.getItem("storageFilm"));
  const modalContent = document.querySelector(".modal-body");
  DOM.removeChildren(modalContent);

  Object.values(bestFilmList).forEach(([title, poster, description, id]) => {
    const BestFilm = DOM.E({ type: "div", classList: ["best-film"], children: [
      DOM.E({ type: "div", classList: ["best-film__left"], children:[ 
      DOM.E({ type: "h3", classList: ["best-film__title"], children: [DOM.T(title)] }),
      DOM.E({ type: "img", classList: ["best-film__img"], attributes: [["src", poster]] }),
      ]}),
      DOM.E({ type: "div", classList: ["best-film__right"], children:[ 
      DOM.E({ type: "h4",  classList: ["best-film__discription"], children: [DOM.T('Описание')] }),
      DOM.E({ type: "div",  classList: ["best-film__Overview"], children: [DOM.T(description)] }),
      DOM.E({ type: "button", classList: ["best-film__button"],
        children: [DOM.T("удалить")],
        events: [["click", e => {
          removeFavorite(id) 
          BestFilm.remove();
        }]],
      }),
    ]}),  
    ]});
    modalContent.appendChild(BestFilm);
  });
});
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
});
window.addEventListener("click", e => {
  if (e.target === document.querySelector(".modal")) {
    document.querySelector(".modal").style.display = "none";
  }
});

const arrow = document.querySelector(".upArrow");

window.addEventListener("scroll", () => {
  scrollFunction();
});

function scrollFunction() {
  document.body.scrollTop > 200 || document.documentElement.scrollTop > 200
    ? arrow.classList.add("visible")
    : arrow.classList.remove("visible");
}

arrow.addEventListener("click", e => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

function scrollDown() {
  document.documentElement.scrollTop = 800;
  document.body.scrollTop = 800;
}
