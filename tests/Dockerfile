FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /tests

COPY package.json ./
RUN npm install

COPY . .

ENV DOCKER=1 \
    CI=true \
    BASE_URL=http://backend:8000

CMD ["npx", "playwright", "test"]
