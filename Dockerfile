# Node.js 18 base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY logipeek_backend/package*.json ./logipeek_backend/

# Install dependencies
RUN npm install
RUN cd logipeek_backend && npm install

# Copy source code
COPY . .

# Build the application
RUN cd logipeek_backend && npm run build

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]