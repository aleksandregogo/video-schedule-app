# Dockerfile

# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (if NestJS runs on 3000, adjust if different)
EXPOSE 3000

# Start the NestJS application with nodemon for auto-reloading
CMD ["npx", "nodemon", "--watch", "src", "--exec", "npm", "run", "start:dev"]