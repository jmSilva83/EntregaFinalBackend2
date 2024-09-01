# Proyecto de E-commerce con Node.JS

Este proyecto es una aplicación de e-commerce completa que incluye la gestión de usuarios, autenticación, productos, carritos de compras y finalización de compras. La aplicación está construida con Node.js, Express y MongoDB, utilizando JWT para la autenticación.

## Características

- **Gestión de Usuarios**: Registro, inicio de sesión y autenticación con JWT.
- **Gestión de Productos**: Crear, actualizar, eliminar y listar productos.
- **Gestión de Carritos de Compras**: Crear carritos, añadir productos, actualizar cantidades, eliminar productos y limpiar carritos.
- **Finalización de Compras**: Generación de tickets de compra.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens) para autenticación
- Handlebars para vistas
- HTML y CSS para el front-end

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd tu-repositorio
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

## Endpoints

### Usuarios

- **POST /api/auth/register** - Registro de usuario
- **POST /api/auth/login** - Inicio de sesión de usuario

### Productos

- **GET /api/products** - Obtener todos los productos
- **GET /api/products/:pid** - Obtener un producto por ID
- **POST /api/products** - Crear un nuevo producto
- **PUT /api/products/:pid** - Actualizar un producto
- **DELETE /api/products/:pid** - Eliminar un producto

### Carritos

- **GET /api/carts** - Obtener todos los carritos
- **GET /api/carts/:cid** - Obtener un carrito por ID
- **POST /api/carts** - Crear un nuevo carrito
- **POST /api/carts/:cid/products/:pid** - Añadir un producto al carrito
- **PUT /api/carts/:cid/products/:pid** - Actualizar la cantidad de un producto en el carrito
- **PUT /api/carts/:cid** - Actualizar los productos del carrito
- **DELETE /api/carts/:cid/products/:pid** - Eliminar un producto del carrito
- **DELETE /api/carts/:cid** - Limpiar el carrito
- **POST /api/carts/:cid/purchase** - Finalizar la compra y generar un ticket

### Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

