'use strict';

const dayjs = require('dayjs');
const sqlite = require('sqlite3');

function Film(id, title, isFavourite = false, dateWatched, rating){
    this.id = id;
    this.title = title;
    this.isFavourite = isFavourite;
    this.dateWatched = dateWatched;
    this.rating = rating;
}

function FilmLibrary(){
    const db = new sqlite.Database("films.db", (err) => { if(err) console.log(err); });

    this.films = [];
    this.addNewFilm = (film) => this.films.push(film);

    this.addNewFilmToDB = (film) => {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO films(id, title, favorite, watchdate, rating) VALUES(?,?,?,DATE(?),?)";
            db.run(sql, [film.id, film.title, film.isFavourite, film.dateWatched?.format("YYYY-MM-DD"), film?.rating], (err) => {
                if(err) reject(err);
                resolve(this.lastID);
            });
        });
    }

    this.deleteFilmFromDB = (id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM films WHERE id = ?", [id], (err) => {
                if(err) reject(err);
                resolve(this.lastID);
            });
        });
    }

    this.deleteAllWatchdateFromDB = () => {
        return new Promise((resolve, reject) => {
            db.run("UPDATE films SET watchdate = NULL", [], (err) => {
                if(err) reject(err);
                resolve(this.lastID);
            });
        });
    }

    this.getAllFilmFromDB = () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM films", [], (err, rows) => {
                if(err) reject(err);
                const films = rows.map( (row) => new Film(row.id, row.title, row.favorite, row.watchdate != undefined ? dayjs(row.watchdate):undefined, row.rating));
                resolve(films);
            });
        });
    }

    this.getFavoriteFilmFromDB = () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM films WHERE favorite = true", [], (err, rows) => {
                if(err) reject(err);
                const films = rows.map( (row) => new Film(row.id, row.title, row.favorite, row.watchdate != undefined ? dayjs(row.watchdate):undefined, row.rating));
                resolve(films);
            });
        });
    }

    this.getFilmWatchedTodayFromDB = () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM films WHERE watchdate = CURRENT_DATE", [], (err, rows) => {
                if(err) reject(err);
                const films = rows.map( (row) => new Film(row.id, row.title, row.favorite, row.watchdate != undefined ? dayjs(row.watchdate):undefined, row.rating));
                resolve(films);
            });
        });
    }

    this.getFilmWatchedBeforeDateFromDB = (date) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM films WHERE watchdate < ?", [date.format("YYYY-MM-DD")], (err, rows) => {
                if(err) reject(err);
                const films = rows.map( (row) => new Film(row.id, row.title, row.favorite, row.watchdate != undefined ? dayjs(row.watchdate):undefined, row.rating));
                resolve(films);
            });
        });
    }

    this.getFilmWithRatingFromDB = (rating) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM films WHERE rating >= ?", [rating], (err, rows) => {
                if(err) reject(err);
                const films = rows.map( (row) => new Film(row.id, row.title, row.favorite, row.watchdate != undefined ? dayjs(row.watchdate):undefined, row.rating));
                resolve(films);
            });
        });
    }

    this.getFilmWithTitleFromDB = (title) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM films WHERE title LIKE ?", [title], (err, rows) => {
                if(err) reject(err);
                const films = rows.map( (row) => new Film(row.id, row.title, row.favorite, row.watchdate != undefined ? dayjs(row.watchdate):undefined, row.rating));
                resolve(films);
            });
        });
    }

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

async function main(){
    const filmLibrary = new FilmLibrary();

    console.log("--------Recupero Film dal DB-------------");
    let films = await filmLibrary.getAllFilmFromDB();
    console.log(films);

    console.log("--------Recupero Film Favorite dal DB-------------");
    films = await filmLibrary.getFavoriteFilmFromDB();
    console.log(films);

    console.log("--------Recupero Film watched today dal DB-------------");
    films = await filmLibrary.getFilmWatchedTodayFromDB();
    console.log(films);

    console.log("--------Recupero Film watchdate < 16-03-2022 today dal DB-------------");
    films = await filmLibrary.getFilmWatchedBeforeDateFromDB(dayjs("2022-03-16"));
    console.log(films);

    console.log("--------Recupero Film con rating >= 4 today dal DB-------------");
    films = await filmLibrary.getFilmWithRatingFromDB(4);
    console.log(films);

    console.log("--------Recupero Film title = 'Pulp fiction' today dal DB-------------");
    films = await filmLibrary.getFilmWithTitleFromDB("Pulp fiction");
    console.log(films);

    console.log("--------Inserisco 2 film nel DB-------------");
    const film1 = new Film(7,"The Office", true, dayjs("March 17, 2022"), 5);
    const film2 = new Film(8,"Big bang theory");
    await filmLibrary.addNewFilmToDB(film1);
    await filmLibrary.addNewFilmToDB(film2);
    console.log(await filmLibrary.getAllFilmFromDB());

    console.log("--------Cancello Big Bang Theory dal DB-------------");
    await filmLibrary.deleteFilmFromDB(film2.id);
    console.log(await filmLibrary.getAllFilmFromDB());

    //COMMENTED BECAUSE THIS WILL DELETE ALL WATCHDATE OF THE FILMS
    //console.log("--------Cancello Tutte le watch date dal DB-------------");
    //await filmLibrary.deleteAllWatchdateFromDB()
    //console.log(await filmLibrary.getAllFilmFromDB());
}

main();

