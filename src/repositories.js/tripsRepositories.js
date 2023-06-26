const { getConnection } = require("../infraestructure/database");

const findTrips = async (query) => {
  const { category, city, orderby } = query;
  const pool = await getConnection();
  let sql = `SELECT trips.*,users.userName, users.image as userImage, COUNT(votes.id) AS votes FROM trips LEFT JOIN votes ON trips.id = votes.IdTrip left join users on users.id = trips.IdUser `;

  let hasWhere = 0;
  for (let data in query) {
    if (!hasWhere) {
      sql += ` WHERE`;
      hasWhere = 1;
    } else {
      sql += ` AND`;
    }
    if (typeof value === "object") {
      sql += ` ${data} IN (?)`;
    } else {
      sql += ` ${data} = ?`;
    }
  }
  sql += ` GROUP BY trips.id`;

  const [trips] = await pool.query(sql, [...Object.values(query)]);

  return [trips, sql];
};

const findTripsOrderByVotes = async (query) => {
  delete query.orderby;

  const pool = await getConnection();
  let sql = `SELECT trips.*, COUNT(votes.id) AS votes FROM trips
  LEFT JOIN votes ON trips.id = votes.IdTrip`;

  let hasWhere = 0;
  for (let datos in query) {
    if (!hasWhere) {
      sql += ` WHERE`;
      hasWhere = 1;
    } else {
      sql += ` AND`;
    }
    if (typeof value === "object") {
      sql += ` ${datos} IN (?)`;
    } else {
      sql += ` ${datos} = ?`;
    }
  }
  sql += ` GROUP BY trips.id ORDER BY votes DESC`;

  const [trips] = await pool.query(sql, [...Object.values(query)]);

  return trips;
};

const findTripById = async (ID) => {
  const pool = await getConnection();
  const sql = `SELECT trips.*, COUNT(votes.id)AS votes, username, email, users.image as userImage FROM trips
  LEFT JOIN votes ON trips.id = votes.IdTrip LEFT JOIN users on users.id = trips.IdUser WHERE TRIPS.ID = ?`;

  const [trips] = await pool.query(sql, [ID]);

  return trips[0];
};

const findUserIdInTrip = async (idTrip) => {
  const pool = await getConnection();
  const sql = `SELECT  trips.idUser FROM trips left join users on users.id = trips.IdUser where trips.id = ?`;
  const [id] = await pool.query(sql, [idTrip]);
  return id;
};

const addTrip = async (body, id) => {
  let {
    title,
    dateExperience,
    category,
    city,
    excerpt,
    description,
    latitude,
    longitude,
  } = body;
  city = city.toUpperCase();
  const now = new Date();

  const pool = await getConnection();
  const sql = `INSERT INTO TRIPS (idUser, title, createAt, dateExperience,  category, city, excerpt, description, latitude, longitude)VALUES(?,?,?,?,?,?,?,?,?,?)`;
  const [trip] = await pool.query(sql, [
    id,
    title,
    now,
    dateExperience,
    category,
    city,
    excerpt,
    description,
    latitude,
    longitude,
  ]);
  return [
    trip.insertId,
    {
      id,
      title,
      now,
      dateExperience,
      category,
      city,
      excerpt,
      description,
      latitude,
      longitude,
    },
  ];
};

const addimage = async (imageName, idTrip) => {
  const pool = await getConnection();
  const sql = `UPDATE trips SET image = ? WHERE id = ?`;
  const [trip] = await pool.query(sql, [imageName, idTrip]);
  return trip.insertId;
};

const deleteTrip = async (id, userId) => {
  const pool = await getConnection();
  const [trip] = await pool.query(`SELECT * FROM trips WHERE id = ?`, [id]);

  if (trip.length === 0) {
    return null;
  }

  if (trip[0].IdUser !== userId) {
    throw new Error("No estás autorizado para borrar esta recomendación");
  }

  const [result] = await pool.query(`DELETE FROM trips WHERE id = ?`, [id]);

  if (result.affectedRows !== 1) {
    throw new Error("Error al borrar la recomendación");
  }

  return trip[0];
};

const findTripsByUserName = async (userName) => {
  const pool = await getConnection();
  const sql = ` SELECT trips.*,users.userName, users.email, users.bio, users.image as userImage, COUNT(votes.id) AS votes FROM trips LEFT JOIN votes ON trips.id = votes.IdTrip left join users on users.id = trips.IdUser where username = ? GROUP BY trips.id ORDER BY votes DESC `;
  const [trips] = await pool.query(sql, [userName]);
  return trips;
};

const findTripsNearby = async () => {
  const pool = await getConnection();
  const sql = ` SELECT trips.*,users.userName, users.image as userImage, COUNT(votes.id) AS votes FROM trips LEFT JOIN votes ON trips.id = votes.IdTrip left join users on users.id = trips.IdUser GROUP BY trips.id`;
  const [trips] = await pool.query(sql);

  return trips;
};

const updateTripRepository = async (body, idTrip) => {
  const {
    title,
    dateExperience,
    category,
    city,
    excerpt,
    description,
    latitude,
    longitude,
  } = body;

  const pool = await getConnection();
  const sql = `UPDATE trips set title = ?, dateExperience = ?, category = ?, city = ?, excerpt = ?, description = ?, latitude = ?, longitude = ? WHERE id = ?`;
  const [trips] = await pool.query(sql, [
    title,
    dateExperience,
    category,
    city,
    excerpt,
    description,
    latitude,
    longitude,
    idTrip,
  ]);
  if (trips.affectedRows === 1) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  findTrips,
  findTripById,
  addTrip,
  addimage,
  findUserIdInTrip,
  deleteTrip,
  findTripsOrderByVotes,
  findTripsByUserName,
  findTripsNearby,
  updateTripRepository,
};
