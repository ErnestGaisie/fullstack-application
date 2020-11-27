const mysql = require("mysql");
const dotenv = require("dotenv");
const { response } = require("express");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db " + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM names;";

        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }

  async insertNewName(name) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

        connection.query(query, [name, dateAdded], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(result.insertId);
        });
      });

      return {
        id: insertId,
        name: name,
        dateAdded: dateAdded,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteRowById(id) {
    id = parseInt(id, 10);
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM names WHERE id = ?";

        connection.query(query, [id], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async updateNameById(id, name) {
    id = parseInt(id, 10);
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE names SET name = ? WHERE id = ?";

        connection.query(query, [name, id], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(result);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async searchByName(name) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM names where name = ?";

        connection.query(query, [name], (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = DbService;
