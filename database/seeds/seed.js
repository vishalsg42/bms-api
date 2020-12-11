class Seed {
  #db = null;
  constructor(db) {
    this.#db = db;
  }

  bulkInsert(tablename, data = []) {
    try {
      return data.length ? this.#db.model(tablename)
        .bulkCreate(data, { returning: true }) : false;
    } catch (error) {
      console.error('error', error);
    }
  }

  fetchContent(tablename) {
    try {
      return this.#db.model(tablename).findAll();
    } catch (error) {
      console.error('error', error);
    }
  }
}

module.exports = Seed;
