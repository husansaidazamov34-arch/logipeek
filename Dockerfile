FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY logipeek_backend/package*.json ./logipeek_backend/

# Install root dependencies
RUN npm install

# Install backend dependencies
WORKDIR /app/logipeek_backend
RUN npm install

# Copy backend source
COPY logipeek_backend/ ./

# Build the application
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start:prod"]