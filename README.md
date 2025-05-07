# CRUD-APIS

APIs for crud operations

## Overview

This project provides APIs for performing CRUD operations on a MongoDB database. The APIs accept the following fields:

```json
{
  "snapPack": "string",
  "description": "string",
  "docLink": "string",
  "category": "string",
  "type": "string",
  "snapPricingCategory": "string",
  "sourceVersion": "string",
  "snapVersion": "string",
  "lastEnhanceMade": "date (default: current timestamp)",
  "AhaBacklogLink": "string",
  "currentWorkItems": "number"
}
```
## CRUD Operations

1. POST: Add a new item to the database.
2. GET: Retrieve all items from the database.
3. GET by ID: Retrieve a specific item by its ID.
4. PUT: Update an item in the database by its ID.
5. DELETE: Remove an item from the database by its ID.

## Live Server

The live server for APIs has been deployed using render.com.
To access the endpoints use the Base url : https://crud-apis-cpov.onrender.com/

## API Endpoints

Method---Endpoint
POST---/items
GET---/items
GET---/items/:id
PUT---/items/:id
DELETE---/items/:id

## How to Run Locally
## Steps

1. Install Nodejs
2. Ensure that to have a mongoDB cluster
3. Clone the Repository:
   git clone https://github.com/your-repo-name.git
   cd CRUD_APIS
4. Install dependencies using command npm install
5. Update the .env file with your MongoDB connection string.
6. Start the Server using command node main.js
7. The server will run on Port : http://localhost:3000.

## Testing APIs

Use Postman for testing the API endpoints.
