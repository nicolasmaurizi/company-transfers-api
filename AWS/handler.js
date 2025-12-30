const express = require("express");
const serverless = require("serverless-http");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// Config
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT,
});

const validateCuit = (cuit) => {
  if (!/^\d{11}$/.test(cuit)) return false;
  const digits = cuit.split('').map(Number);
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

  const sum = multipliers.reduce((acc, multiplier, i) => acc + digits[i] * multiplier, 0);
  const mod11 = 11 - (sum % 11);
  const checkDigit = mod11 === 11 ? 0 : mod11 === 10 ? 9 : mod11;

  return checkDigit === digits[10];
};

app.post("/adhesion", async (req, res) => {
	const { cuit, razonSocial } = req.body;

	if (!cuit || !razonSocial) {
		return res
			.status(400)
			.json({ error: "Faltan campos requeridos: cuit y razonSocial." });
	}

	if (!validateCuit(cuit)) {
		return res
			.status(400)
			.json({ error: "CUIT inválido. Debe contener 13 dígitos numéricos." });
	}

	try {
		const result = await pool.query(
			"INSERT INTO empresas (cuit, razon_social) VALUES ($1, $2) RETURNING *",
			[cuit, razonSocial]
		);

		return res
			.status(200)
			.json({ message: "Adhesión registrada", data: result.rows[0] });
	} catch (err) {
		console.error("Error al escribir en la base de datos:", err);
		return res
			.status(500)
			.json({ error: "Error al registrar la adhesión", details: err.message });
	}
});

module.exports.handler = serverless(app);
