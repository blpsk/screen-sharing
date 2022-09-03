# === BUILD STAGE ===
FROM node:lts-alpine as build-stage

# Setup working directory
WORKDIR /app

# Copy package.json
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy code
COPY . .

# Build the application
RUN npm run build

# === PRODUCTION STAGE ===
FROM nginx:stable-alpine as production-stage

# Copy built application files
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the HTTP port
EXPOSE 80

# Start command
CMD ["nginx", "-g", "daemon off;"]
