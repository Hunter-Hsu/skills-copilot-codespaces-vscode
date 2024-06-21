// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments');

const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);
  // Get the pathname
  let pathname = `.${parsedUrl.pathname}`;
  // Check if the pathname is /comments
  if (pathname === './comments') {
    // Check if the request is GET
    if (req.method === 'GET') {
      // Get the comments
      comments.getComments((err, data) => {
        // If there is an error, send a 500 response
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
        } else {
          // Send the comments as JSON
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        }
      });
    } else if (req.method === 'POST') {
      // If the request is POST
      let body = '';
      // Set the encoding to UTF-8
      req.setEncoding('utf8');
      // Append data to the body
      req.on('data', chunk => {
        body += chunk;
      });
      // When the request ends
      req.on('end', () => {
        // Parse the body
        let params = JSON.parse(body);
        // Add the comment
        comments.addComment(params, (err, data) => {
          // If there is an error, send a 500 response
          if (err) {
            res.writeHead(500);
            res.end('Server Error');
          } else {
            // Send the comments as JSON
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          }
        });
      });
    }
  } else {
    // If the pathname is not /comments
    // Check if the file exists
    fs.exists(pathname, exists => {
      if (!exists) {
        // If the file does not exist, send a 404 response
        res.writeHead(404);
        res.end('File not found!');
      } else {
        // If the file exists, read the file
        fs.readFile(pathname, (err, data) => {
          if (err)