FROM node:22-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Install directus-template-cli globally
RUN npm install -g directus-template-cli@latest

COPY bootstrap.js .

# Expose health check port
EXPOSE 3001

CMD ["node", "bootstrap.js"]