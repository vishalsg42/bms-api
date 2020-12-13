require('../../src/requireAllModels');
const sequelize = require('../../src/config/dbConfig').default;
const {
  map,
  find,
} = require('lodash');
const {
  movies,
  cities,
  cinemas
} = require('./fakeDb');
const seed = require('./seed');
const {
  logger: {
    infoLog
  }
} = require('../../logger');
async function main() {
  const initSeed = new seed(sequelize);

  infoLog.info('Inserting: City');
  initSeed.bulkInsert('city', cities)
    .then(async cities => {
      infoLog.info('Successfully inserted: City');
      if (Array.isArray(cities) && cities.length) {
        let cinemaList = cinemas.map(c => {
          c['city_id'] = (find(cities, ['name', c['city']]))['dataValues']['id'];
          return c;
        });

        // Insert Cinema
        infoLog.info('Inserting: Cinema');
        let insertedCinemaList = await initSeed.bulkInsert('cinema', cinemaList);
        let cinemaHallList = [];
        // let cinemaHallCount = reduce(, 0);
        let cinemaHallCount = map(insertedCinemaList, (c) => {
          return {
            id: c['dataValues']['id'], total_cinema_halls: c['dataValues']['total_cinema_halls']
          };
        });
        for (let index = 0; index < cinemaHallCount.length; index++) {
          for (let j = 0; j < cinemaHallCount[index]['total_cinema_halls']; j++) {
            cinemaHallList.push({
              name: 'screen ' + (j + 1),
              total_seats: randomRangeNumber(10, 20),
              cinema_id: cinemaHallCount[index]['id']
            });
          }
        }
        infoLog.info('Successfully inserted: Cinema');
        // Insert cinema screen
        infoLog.info('Inserting: Cinema Hall');
        let insertedCinemaHall = await initSeed.bulkInsert('cinema_hall', cinemaHallList);
        insertedCinemaHall = map(insertedCinemaHall, (c) => {
          return {
            id: c['dataValues']['id'],
            total_seats: c['dataValues']['total_seats'],
          };
        });
        infoLog.info('Successfully inserted: Cinema Hall');

        // Insert seat for cinema halls
        let cinemaSeatList = [];
        // console.log("cinemaHall ", insertedCinemaHall);
        // process.exit();

        for (let index = 0; index < insertedCinemaHall.length; index++) {
          for (let j = 0; j < insertedCinemaHall[index]['total_seats']; j++) {
            cinemaSeatList.push({
              seat_number: j + 1,
              cinema_hall_id: insertedCinemaHall[index]['id']
            });
          }
        }

        infoLog.info('Inserting: Cinema Seat');
        await initSeed.bulkInsert('cinema_seat', cinemaSeatList);
        infoLog.info('Successfully inserted: Cinema Seat');

        infoLog.info('Inserting: Movies');
        let insertingMovies = await initSeed.bulkInsert('movie', movies);
        infoLog.info('Successfully inserted: Movies');

        infoLog.info('Inserting: show');
        let showTime = [9, 12, 15, 18];
        let showTimeList = [];
        const currentDate = new Date();

        let getCinemas = await initSeed.fetchContent('cinema_hall');
        currentDate.setDate(currentDate.getDate() + 1);
        insertingMovies.map((movie, i) => {
          currentDate.setDate(currentDate.getDate() + 1 + i);
          getCinemas.map(cinema => {
            showTime.map(st => {
              let stime = {
                date: currentDate,
                start_time: currentDate.setHours(currentDate.getHours() + st),
                end_time: currentDate.setHours(currentDate.getHours() + st + 3),
                movie_id: movie['dataValues']['id'],
                cinema_hall_id: cinema['dataValues']['id'],
              };
              showTimeList.push(stime);
            });
          });
        });
        await initSeed.bulkInsert('show', showTimeList);
        infoLog.info('Successfully inserted: shows');
      }
    }).catch(error => {
      console.log('error ', error);
      throw new Error(error);
    });

}

main();

function randomRangeNumber(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

