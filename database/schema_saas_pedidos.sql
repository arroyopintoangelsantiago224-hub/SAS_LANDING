-- =============================================
-- CREAR BASE DE DATOS SAAS_PEDIDOS
-- =============================================

CREATE DATABASE IF NOT EXISTS saas_pedidos;
USE saas_pedidos;

-- =============================================
-- TABLA: EMPRESAS (Clientes del SaaS)
-- =============================================
CREATE TABLE empresas (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(255),
    color_primario VARCHAR(7),
    color_secundario VARCHAR(7),
    ubicacion VARCHAR(255),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    plan VARCHAR(50) DEFAULT 'basico', -- basico, pro, premium
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    fecha_suscripcion DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_estado (estado)
);

-- =============================================
-- TABLA: USUARIOS (Multi-tenant)
-- =============================================
CREATE TABLE usuarios (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    empresa_id BIGINT UNSIGNED NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255),
    google_id VARCHAR(255),
    telefono VARCHAR(20),
    rol ENUM('admin', 'editor', 'cliente') DEFAULT 'cliente',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_email_empresa (empresa_id, email),
    INDEX idx_empresa_id (empresa_id),
    INDEX idx_google_id (google_id)
);

-- =============================================
-- TABLA: CATEGORIAS (Multi-tenant)
-- =============================================
CREATE TABLE categorias (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    empresa_id BIGINT UNSIGNED NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    orden INT DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_empresa_id (empresa_id),
    INDEX idx_activa (activa)
);

-- =============================================
-- TABLA: PRODUCTOS (Multi-tenant)
-- =============================================
CREATE TABLE productos (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    empresa_id BIGINT UNSIGNED NOT NULL,
    categoria_id BIGINT UNSIGNED NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_empresa_id (empresa_id),
    INDEX idx_categoria_id (categoria_id),
    INDEX idx_disponible (disponible)
);

-- =============================================
-- TABLA: DIRECCIONES (Multi-tenant - Clientes)
-- =============================================
CREATE TABLE direcciones (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    empresa_id BIGINT UNSIGNED NOT NULL,
    usuario_id BIGINT UNSIGNED NOT NULL,
    calle VARCHAR(255) NOT NULL,
    numero VARCHAR(50) NOT NULL,
    complemento VARCHAR(255),
    ciudad VARCHAR(255) NOT NULL,
    provincia VARCHAR(255) NOT NULL,
    codigo_postal VARCHAR(20),
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_empresa_id (empresa_id),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_es_principal (es_principal)
);

-- =============================================
-- TABLA: PEDIDOS (Multi-tenant)
-- =============================================
CREATE TABLE pedidos (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    empresa_id BIGINT UNSIGNED NOT NULL,
    usuario_id BIGINT UNSIGNED NOT NULL,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    direccion_id BIGINT UNSIGNED,
    total DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    impuestos DECIMAL(10, 2) DEFAULT 0,
    descuento DECIMAL(10, 2) DEFAULT 0,
    estado ENUM('pendiente', 'confirmado', 'preparando', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
    metodo_pago VARCHAR(50), -- efectivo, tarjeta, billetera
    nota_especial TEXT,
    hora_entrega_estimada DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL,
    INDEX idx_empresa_id (empresa_id),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (created_at)
);

-- =============================================
-- TABLA: ITEMS_PEDIDOS (Detalles del pedido)
-- =============================================
CREATE TABLE items_pedidos (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    pedido_id BIGINT UNSIGNED NOT NULL,
    producto_id BIGINT UNSIGNED NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    INDEX idx_pedido_id (pedido_id)
);

-- =============================================
-- TABLA: CONFIGURACION_EMPRESA (Personalización)
-- =============================================
CREATE TABLE configuracion_empresa (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    empresa_id BIGINT UNSIGNED UNIQUE NOT NULL,
    horario_apertura TIME,
    horario_cierre TIME,
    dias_entrega_permitidos VARCHAR(50), -- lun,mar,mié,jue,vie,sab,dom
    entrega_minima_permitida INT DEFAULT 30, -- en minutos
    tiempo_promedio_preparacion INT DEFAULT 45, -- en minutos
    permite_entregas BOOLEAN DEFAULT TRUE,
    dominio_personalizado VARCHAR(255),
    nivel_personalizacion ENUM('basico', 'intermedio', 'avanzado') DEFAULT 'basico',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_empresa_id (empresa_id)
);

-- =============================================
-- TABLA: AUDITORÍA (Para rastrear cambios)
-- =============================================
CREATE TABLE auditoria (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    empresa_id BIGINT UNSIGNED NOT NULL,
    usuario_id BIGINT UNSIGNED,
    accion VARCHAR(50) NOT NULL, -- crear, actualizar, eliminar
    tabla VARCHAR(50) NOT NULL,
    registro_id BIGINT UNSIGNED,
    cambios JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_empresa_id (empresa_id),
    INDEX idx_fecha (created_at)
);

-- =============================================
-- ÍNDICES ADICIONALES PARA PERFORMANCE
-- =============================================
CREATE INDEX idx_pedidos_empresa_fecha ON pedidos(empresa_id, created_at DESC);
CREATE INDEX idx_productos_empresa_categoria ON productos(empresa_id, categoria_id);
CREATE INDEX idx_usuarios_empresa_rol ON usuarios(empresa_id, rol);

-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- Insertar empresa de prueba
INSERT INTO empresas (nombre, slug, email, plan, estado)
VALUES ('Mi Restaurante Test', 'mi-restaurante', 'admin@mirestaurante.com', 'basico', 'activo');

-- Insertar usuario admin
INSERT INTO usuarios (empresa_id, nombre, email, contraseña, rol, estado)
VALUES (1, 'Admin Usuario', 'admin@mirestaurante.com', 'hash_password', 'admin', 'activo');

-- Insertar categorías
INSERT INTO categorias (empresa_id, nombre, descripcion, orden)
VALUES 
(1, 'Hamburguesas', 'Deliciosas hamburguesas artesanales', 1),
(1, 'Pizzas', 'Pizzas tradicionales y gourmet', 2),
(1, 'Bebidas', 'Refrescos y bebidas', 3);

-- Insertar productos
INSERT INTO productos (empresa_id, categoria_id, nombre, descripcion, precio, disponible)
VALUES 
(1, 1, 'Hamburguesa Clásica', 'Hamburguesa con queso y lechuga', 8.50, TRUE),
(1, 1, 'Hamburguesa Doble', 'Dos carnes con queso derretido', 12.00, TRUE),
(1, 2, 'Pizza Margherita', 'Tomate, mozzarella y albahaca', 10.00, TRUE),
(1, 3, 'Gaseosa 2L', 'Refrescos variados', 3.00, TRUE);

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
