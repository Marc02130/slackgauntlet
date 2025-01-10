#!/bin/sh
npx prisma generate
NODE_ENV=production node server.js 