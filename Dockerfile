# Usamos una imagen oficial de Node.js como base. La versión 20 es moderna y estable.
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias PRIMERO para aprovechar el caché de Docker
COPY package.json ./
# Usaremos npm ci para una instalación más rápida y consistente
COPY package-lock.json ./

# Instalamos las dependencias del proyecto
RUN npm ci

# Copiamos el resto de los archivos de la aplicación
COPY public ./public
COPY src ./src
COPY index.html .
COPY vite.config.ts .
COPY tsconfig.json .
COPY tsconfig.app.json .
COPY tsconfig.node.json .
COPY eslint.config.js .

# Exponemos el puerto que Vite usa por defecto
EXPOSE 5173

# El comando que se ejecutará por defecto cuando inicie el contenedor
CMD ["npm", "run", "dev"]