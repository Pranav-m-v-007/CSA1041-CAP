# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy ALL project files (including images folder)
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]