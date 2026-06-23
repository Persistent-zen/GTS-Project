# Use Node 18 LTS Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma files first for caching
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy all other source code
COPY . .

# Build TS to JS
RUN npm run build

# Expose backend port
EXPOSE 5000

# Start server
CMD ["npm", "run", "start"]
