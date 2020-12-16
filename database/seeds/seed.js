class Seed {
  #db = null;
  constructor(db) {
    this.#db = db;
  }

  bulkInsert(tablename, data = []) {
    try {
      return data.length ? this.#db[tablename].bulkCreate(data, { returning: true }) : false;
    } catch (error) {
      console.error('error', error);
    }
  }

  fetchContent(tablename) {
    try {
      return this.#db[tablename].findAll();
    } catch (error) {
      console.error('error', error);
    }
  }

  async bulkInsertInBatch(tablename, items = []) {
    try {
      let batchSize = 500,
        batches = [[]],
        currentBatch = 0;

      for (var item of items) {
        if (batches[currentBatch].length >= batchSize) {
          batches.push([]);
          currentBatch = batches.length - 1;
        }

        batches[currentBatch].push(item);
      }

      Promise.all(batches.map(batch => this.#db[tablename].bulkCreate(batch)));
    } catch (error) {
      console.error('error', error);
    }
  }

  async fetchCinemaList() {
    let query = `SELECT
              sh.id AS show_id,
              cs.id AS cinema_seat_id
          FROM
              shows sh,
              cinema_seats cs
          WHERE
              sh.cinema_hall_id = cs.cinema_hall_id`;

    let fetchSeatList = await this.#db.sequelize.query(query, {
      type: this.#db.Sequelize.QueryTypes.SELECT
    });
    return fetchSeatList;
  }
}

module.exports = Seed;
