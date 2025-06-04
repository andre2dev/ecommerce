FROM node:23-bookworm-slim

WORKDIR /app

# Install dependencies based on package.json
COPY package*.json ./
RUN npm install

# Copy rest of the project
COPY . .

EXPOSE 3000

# CMD  ["npm", "run", "dev"] 
RUN npm run build --no-cache
CMD  ["npm", "start"] 
