FROM node:20.19-slim
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5174
ENTRYPOINT ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 