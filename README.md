# react-stream

This is a real-time subscription management test project written in React/Node with Socket.io and Redis.

### Backend

1. Up Redis container via:

```bash
  docker-compose run
```

2. Go to `api` folder and install dependencies:

```bash
  yarn install
```

3. Run server:

```bash
  yarn build && yarn start
```

### Frontend

1. Go to `web` folder and install dependencies:

```bash
  yarn install
```

2. Run application:

```bash
  yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Tests

Both parts include tests, you can run them with:

```bash
  yarn test
```
