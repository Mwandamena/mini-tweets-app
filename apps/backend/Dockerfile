FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]