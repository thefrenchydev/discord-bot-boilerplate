FROM oven/bun:1

WORKDIR /usr/src/app

# Copy dependency files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Start the application
CMD [ "bun", "run", "start:prod" ]
