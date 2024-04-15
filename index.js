// Importar módulos
const http = require("http");
const url = require("url");
const fs = require("fs");

const port = 3000;

// Crear servidor
http
  .createServer((req, res) => {
    // Ruta raíz para disponibilizar el archivo index.html
    if (req.url == "/") {
      res.writeHead(200, { "Content-Type": "text:html" });
      fs.readFile("index.html", "utf8", (err, html) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        res.end(html);
      });
      return;
    }

    // Query strings desde la url
    const { nombre, precio } = url.parse(req.url, true).query;

    // Objeto que se guarda
    let deporte = {
      nombre,
      precio,
    };

    // Ruta para agregar nuevos registros al archivo deportes.json
    if (req.url.startsWith("/agregar")) {
      let data = JSON.parse(fs.readFileSync("./deportes.json", "utf8"));

      let deportes = data.deportes;

      deportes.push(deporte);

      fs.writeFileSync("./deportes.json", JSON.stringify(data, null, 1));
      res.end();
    }

    // Ruta para disponibilizar los datos desde archivo deportes.json
    if (req.url.includes("/deportes")) {
      fs.readFile("./deportes.json", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        // Check if data exists and is not empty
        if (data && data.length > 0) {
          res.write(data);
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("No data found");
          return;
        }
        res.end();
      });
    }

    // Ruta para actualizar registros del archivo deportes.json
    if (req.url.startsWith("/editar")) {
      let data = JSON.parse(fs.readFileSync("./deportes.json", "utf8"));

      let deportes = data.deportes;

      deportes.map((d) => {
        if (d.nombre == nombre) {
          d.precio = precio;
        } else {
          return d;
        }
      });

      fs.writeFileSync("./deportes.json", JSON.stringify(data, null, 1));
      res.end();
    }

    // Ruta para borrar registros del archivo deportes.json
    if (req.url.startsWith("/eliminar")) {
      let data = JSON.parse(fs.readFileSync("./deportes.json", "utf8"));

      let deportes = data.deportes;

      data.deportes = deportes.filter((d) => {
        return d.nombre !== nombre;
      });

      fs.writeFileSync("./deportes.json", JSON.stringify(data, null, 1));
      res.end();
    }
  })
  .listen(port, () => console.log(`Server running on port ${port}`));
