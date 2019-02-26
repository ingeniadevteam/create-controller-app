"use strict";

module.exports = {
  properties: {
    description: {
      required: true,
      default: ''
    },
    author: {
      required: true,
      default: ''
    },
    email: {
      required: true,
      default: ''
    },
    authorURL: {
      required: false,
      default: ''
    }
  }
};
