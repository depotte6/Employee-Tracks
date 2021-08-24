const mysql = require('mysql2');
const inquirer = require('inquirer');
const console = require('console.table');
const express = require('express');

const PORT = process.env.port || 3001;
const app=express();



app.listen(PORT, () => 
    console.log(`Listening at http://localhost:${PORT}`));