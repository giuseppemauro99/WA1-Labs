'use strict';

const dayjs = require('dayjs');

function Film(id, title, isFavourite = false, dateWatched, rating){
    this.id = id;
    this.title = title;
    this.isFavourite = isFavourite;
    this.dateWatched = dateWatched;
    this.rating = rating;
}

function FilmLibrary(){
    this.films = [];
    this.addNewFilm = (film) => this.films.push(film);

    this.sortByDate = () => {
        // [...variableName] crea un nuovo array (di default userebbe il riferimento a quello vecchio)
        return [...this.films].sort((a,b) => {
                if(a.dateWatched == undefined) return 1; //mette alla fine gli undefined
                if(b.dateWatched == undefined) return -1;
                a.dateWatched.isAfter(b.dateWatched) ? 1 : -1;
                });
    }

    this.deleteFilm = (film) => this.films = this.films.filter( a => a != film);

    this.getRated = () => {
        return [...this.films].filter(a => a.rating != undefined).sort( (a,b) => a.rating > b.rating ? -1 : 1);
    }
}

const film1 = new Film(1,"Pulp Fiction", true, dayjs("March 10, 2022"), 5);
const film2 = new Film(2,"21 Grams", true, dayjs("March 17, 2022"), 4);
const film3 = new Film(3,"Star Wars");
const film4 = new Film(4,"Matrix");
const film5 = new Film(5,"Shrek", false, dayjs("March 21, 2022"), 3);

const filmLibrary = new FilmLibrary();
filmLibrary.addNewFilm(film1);
filmLibrary.addNewFilm(film2);
filmLibrary.addNewFilm(film3);
filmLibrary.addNewFilm(film4);
filmLibrary.addNewFilm(film5);

console.log("Sort by date: ");
console.log(filmLibrary.sortByDate());
console.log("-------------------------------------------");

console.log("Rated films: ");
console.log(filmLibrary.getRated());
console.log("-------------------------------------------");

filmLibrary.deleteFilm(film1);
console.log("Afeter delete film1: ");
console.log(filmLibrary.films);
console.log("-------------------------------------------");