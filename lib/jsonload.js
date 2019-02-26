"use strict";

const fs = require("fs");

module.exports = (file) => {
  let content, parsed;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (e) {
    throw e;
  }

  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw e;
  }

  return parsed;
};
