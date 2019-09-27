store.more.onChange(film => {
  const defaultPoster = "9Tl1O1tfeu8zBh1rSS4lPbJzwTM.jpg";
  const containerMoreLeft = DOM.E({
    type: "div",
    classList: ["container-more__left"],
    children: [
      DOM.E({
        type: "div",
        classList: ["container-more__additionally"],
        children: [
          DOM.E({
            type: "span",
            classList: ["additionally-inner__runtime"], 
            children: [
              DOM.T(`Продолжительность: ${film.runtime} мин`),
            ],
          }),
          DOM.E({
            type: "span",
            classList: ["additionally-inner__revenue"], 
            children: [
              DOM.T(film.revenue
                  ? `Сборы: $${film.revenue.toLocaleString("en")}`
                  : "Сборы: информация отсутствует"),
            ],
          }),
          DOM.E({
            type: "span",
            classList: ["additionally-inner__budget"], 
            children: [
              DOM.T(film.budget
                  ? `Бюджет: $${film.budget.toLocaleString("en")}`
                  : "Бюджет: информация отсутствует"),
              ],
          }),
          DOM.E({
            type: "span",
            classList: ["additionally-inner__tagline"], 
            children: [
              DOM.T(film.tagline
                  ? `Слоган: $${film.tagline}`
                  : "Слоган: информация отсутствует"),
            ],
          }),
          DOM.E({
            type: "span",
            classList: ["additionally-inner__originalTitle"], 
            children: [
              DOM.T(film.original_title
                  ? `Оригинальное название: ${film.original_title}`
                  : "Оригинальное название: информация отсутствует"),
            ],
          }),
        ],
      }),
      DOM.E({
        type: "img",
        classList: ["container-more__poster"], 
        attributes: [
          ["src", `https://image.tmdb.org/t/p/w300/${film.poster_path || defaultPoster}`],
        ],
      }),
    ],
  });
  const containerMoreFilm = DOM.E({ type: "div", classList: ["container-more"] });;
  const backgroundMoreFilm = document.createElement("div");
  backgroundMoreFilm.classList.add("background-container__more");
  //create button add
  const blockAddBest = document.createElement("div");
  blockAddBest.classList.add("info-inner__add");
  const buttonAddBestFilm = document.createElement("button");
  buttonAddBestFilm.classList.add("add-best-film");
  buttonAddBestFilm.innerText = "Добавить в израбанное";
  blockAddBest.appendChild(buttonAddBestFilm);
  
  /////// create info film

  const infoFilmBlock = document.createElement("div");
  infoFilmBlock.classList.add("container-more__info");

  /// create info inner
  const infoInner = document.createElement("div");
  infoInner.classList.add("info-inner");

  /// create info inner components
  const titleFilm = document.createElement("h3");
  titleFilm.classList.add("info-inner__title");
  const releaseFilm = document.createElement("span");
  releaseFilm.classList.add("info-inner__release");
  const ratingFilm = document.createElement("div");
  ratingFilm.classList.add("info-inner__rating");
  const overviewFilm = document.createElement("div");
  overviewFilm.classList.add("info-inner__overview");
  /// inner text info inner components
  titleFilm.innerText = film.title;
  ratingFilm.innerText = `Рейтинг зрителей ${film.vote_average}`;
 // releaseFilm.innerText = `(${film.release_date.slice(0, 4)})`;
  overviewFilm.innerText = film.overview;

  ////// create genres
  const textGenres = document.createElement("span");
  textGenres.innerText = "Жанры: ";
  const innerGenres = document.createElement("div");
  innerGenres.classList.add("info-inner__genres");
  innerGenres.appendChild(textGenres);
  film.genres.forEach(genre => {
    const genres = document.createElement("span");
    genres.classList.add("item-genres");
    genres.innerText = genre.name;
    innerGenres.appendChild(genres);
  });

  //////////////////create actor

  const innerActors = document.createElement("div");
  innerActors.classList.add("info-inner__actors");

  const titleActors = document.createElement("h4");
  titleActors.innerText = "В главной роли";
  innerActors.appendChild(titleActors);

  film.credits.cast.slice(0, 5).forEach(actor => {
    const itemActors = document.createElement("div");
    itemActors.classList.add("actors-item");
    const actorCharacter = document.createElement("span");
    const actorName = document.createElement("span");
    const actorImage = document.createElement("img");
    actorImage.classList.add("actors-img");
    actorCharacter.classList.add("actors-character");
    actorName.classList.add("actors-name");
    actor.profile_path
      ? actorImage.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
        )
      : actorImage.setAttribute(
          "src",
          `https://tonkostipdd.ru/sites/all/themes/autotonkosti/images/d-avatar.png`
        );
    actorCharacter.innerText = actor.character;
    actorName.innerText = actor.name;
    itemActors.appendChild(actorImage);
    itemActors.appendChild(actorCharacter);
    itemActors.appendChild(actorName);
    innerActors.appendChild(itemActors);
  });
  ////////////////////////////create  crew
  const innerCrew = document.createElement("div");
  innerCrew.classList.add("info-inner__crew");
  const titleCrew = document.createElement("h4");
  titleCrew.innerText = "Cъемочная группа";
  innerCrew.appendChild(titleCrew);
  film.credits.crew.slice(0, 5).forEach(crew => {
    const crewName = document.createElement("div");
    crewName.classList.add("name-crew");
    crewName.innerText = crew.name;
    const crewDepartment = document.createElement("div");
    crewDepartment.classList.add("department-crew");
    crewDepartment.innerText = crew.department;
    const crewImage = document.createElement("img");
    crewImage.classList.add("crew-image");
    crew.profile_path
      ? crewImage.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/w200/${crew.profile_path}`
        )
      : crewImage.setAttribute(
          "src",
          `https://tonkostipdd.ru/sites/all/themes/autotonkosti/images/d-avatar.png`
        );

    const crewItem = document.createElement("div");
    crewItem.classList.add("crew-item");
    crewItem.appendChild(crewImage);
    crewItem.appendChild(crewName);
    crewItem.appendChild(crewDepartment);
    innerCrew.appendChild(crewItem);
  });
  ////////create button close
  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = "&times;";

  //////////////append all
  infoInner.appendChild(titleFilm);
  //infoInner.appendChild(releaseFilm);
  infoInner.appendChild(ratingFilm);
  infoInner.appendChild(overviewFilm);
  infoInner.appendChild(blockAddBest);
  infoInner.appendChild(innerGenres);
  infoInner.appendChild(innerActors);
  infoInner.appendChild(innerCrew);
  infoFilmBlock.appendChild(infoInner);
  containerMoreFilm.appendChild(containerMoreLeft);
  containerMoreFilm.appendChild(infoFilmBlock);
  containerMoreFilm.appendChild(closeButton);

  backgroundMoreFilm.appendChild(containerMoreFilm);
  document.querySelector(".container-main").appendChild(backgroundMoreFilm);

  //////addBestFilmToLocalStorage
  buttonAddBestFilm.addEventListener("click", () => {
    const filmName = film.title;
    const filmImage = `https://image.tmdb.org/t/p/w300/${film.poster_path}`;
    const filmOverview = film.overview;
    const filmId = film.id;

    addFavorite(filmId, filmName, filmImage, filmOverview, filmId);
  });

  ////close more modal/////////
  function closeMoreFilm() {
    window.addEventListener("click", e => {
      if (e.target.className === "background-container__more") {
        document
          .querySelector(".container-main")
          .removeChild(document.querySelector(".container-main").lastChild);
      }
    });
    closeButton.addEventListener("click", () => {
      document
        .querySelector(".container-main")
        .removeChild(document.querySelector(".container-main").lastChild);
    });
  }

  closeMoreFilm();
});
