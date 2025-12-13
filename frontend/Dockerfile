FROM node:20-alpine

WORKDIR /app

# Optional proxy support for corporate networks
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV http_proxy=$HTTP_PROXY \
    https_proxy=$HTTPS_PROXY \
    no_proxy=$NO_PROXY

# Copy package files
COPY package*.json ./

# Install dependencies (with retry-friendly npm settings)
RUN npm config set registry https://registry.npmjs.org \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm ci

# Copy project files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

