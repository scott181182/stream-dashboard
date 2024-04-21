FROM oven/bun:distroless

WORKDIR /app
COPY package.json bun.lockb /app/
RUN [ "bun", "install", "--production" ]

COPY . /app/
ENTRYPOINT [ "bun" ]
CMD [ "run", "/app/server.ts" ]
