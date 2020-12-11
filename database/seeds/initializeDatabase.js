require('../../src/requireAllModels');
const sequelize = require('../../src/config/dbConfig').default;
const {
  map,
  find
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
        for (let index = 0; index < randomRangeNumber(1, 3); index++) {
          cinemaHallList.push(...map(insertedCinemaList, (cinema) => {
            return {
              name: 'screen ' + (index + 1),
              total_seats: randomRangeNumber(10, 20),
              cinema_id: cinema['dataValues']['id']
            };
          }));
        }
        infoLog.info('Successfully inserted: Cinema');
        // Insert cinema screen
        infoLog.info('Inserting: Cinema Hall');
        let insertedCinemaHall = await initSeed.bulkInsert('cinema_hall', cinemaHallList);
        insertedCinemaHall = map(insertedCinemaHall, 'dataValues.id');
        infoLog.info('Successfully inserted: Cinema Hall');

        // Insert seat for cinema halls
        let cinemaSeatList = [];
        insertedCinemaHall.map(cinemaHall => {
          for (let seatLimit = 0; seatLimit < randomRangeNumber(10, 15); seatLimit++) {
            cinemaSeatList.push({
              seat_number: seatLimit + 1,
              cinema_hall_id: cinemaHall
            });
          }
        });

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

function randomRangeNumber(start = 0, end = 1) {
  return Math.floor(Math.random() * end + start);
}

