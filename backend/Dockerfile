# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json primero para cachear las dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código (tu index.js)
COPY index.js .

# Exponer el puerto que definimos en index.js
EXPOSE 5000

# Comando para iniciar el servidor
CMD [ "npm", "start" ]