# API de Adhesión de Empresas (Lambda con Express + PostgreSQL)

Esta función Lambda permite registrar solicitudes de adhesión de empresas a un sistema.  
Recibe un **CUIT** y una **Razón Social**, valida el formato del CUIT (incluyendo el dígito verificador) y almacena los datos en una base de datos PostgreSQL.

## 🛠️ Requisitos previos
Node.js 18+
PostgreSQL
Serverless Framework
Credenciales de AWS (Iam)

## Instalación
npm init -y
npm install express serverless-http pg
npm install --save-dev serverless serverless-offline
npm install --save-dev jest supertest

## Configuración
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=clean_arch_db
PORT=3000
```

## 🚀 Funcionalidad

- **POST** `/adhesion`  
  Recibe un cuerpo JSON:
  ```json
  {
    "cuit": "20329642330",
    "razonSocial": "Empresa Test SA"
  }

## Respuestas:

200 OK → Adhesión registrada exitosamente.
400 Bad Request → Faltan campos o CUIT inválido.
409 Conflict → Empresa ya registrada (CUIT o razón social duplicados).
500 Internal Server Error → Error en la base de datos u otro problema interno.

## 📌 Notas
La validación del CUIT utiliza el algoritmo oficial de AFIP para verificar el dígito.

