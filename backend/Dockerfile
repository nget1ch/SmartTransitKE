FROM node:24.14.1-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
