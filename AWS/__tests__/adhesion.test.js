const request = require('supertest');
const express = require('express');
const serverless = require('serverless-http');
const { Pool } = require('pg');

// Mock DB con pg
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'testdb',
  password: process.env.DB_PASS || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const app = express();
app.use(express.json());

const validateCuit = (cuit) => {
  if (!/^\d{11}$/.test(cuit)) return false;
  const digits = cuit.split('').map(Number);
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = multipliers.reduce((acc, multiplier, i) => acc + digits[i] * multiplier, 0);
  const mod11 = 11 - (sum % 11);
  const checkDigit = mod11 === 11 ? 0 : mod11 === 10 ? 9 : mod11;
  return checkDigit === digits[10];
};

app.post('/adhesion', async (req, res) => {
  const { cuit, razonSocial } = req.body;
  if (!cuit || !razonSocial) {
    return res.status(400).json({ error: 'Faltan campos requeridos: cuit y razonSocial.' });
  }
  if (!validateCuit(cuit)) {
    return res.status(400).json({ error: 'CUIT inválido. Dígito verificador incorrecto.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO empresas (cuit, razon_social) VALUES ($1, $2) RETURNING *',
      [cuit, razonSocial]
    );
    return res.status(200).json({ message: 'Adhesión registrada', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Empresa ya registrada (CUIT o razón social duplicado).' });
    }
    return res.status(500).json({ error: 'Error al registrar la adhesión' });
  }
});

const server = serverless(app);

describe('POST /adhesion', () => {
  it('debería registrar empresa válida', async () => {
    const response = await request(app)
      .post('/adhesion')
      .send({
        cuit: '20329642330', // CUIT válido
        razonSocial: 'Empresa Test SA'
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('cuit', '20329642330');
  });

  it('debería fallar con CUIT inválido', async () => {
    const response = await request(app)
      .post('/adhesion')
      .send({
        cuit: '20329642399',
        razonSocial: 'Empresa Inválida'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/CUIT inválido/);
  });

  it('debería fallar si falta razón social', async () => {
    const response = await request(app)
      .post('/adhesion')
      .send({ cuit: '20329642330' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Faltan campos/);
  });

  it('debería detectar duplicado', async () => {
    const data = { cuit: '20329642330', razonSocial: 'Empresa Duplicada SA' };

    await request(app).post('/adhesion').send(data);
    const response = await request(app).post('/adhesion').send(data);

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/duplicado/);
  });
});
