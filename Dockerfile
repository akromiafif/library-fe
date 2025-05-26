# Use an official lightweight Node.js image.
FROM node:20-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json (if available) first,
# so Docker can cache installed dependencies.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Expose Vite's default port.
EXPOSE 3039

# Start the development server.
CMD ["npm", "run", "dev"]
