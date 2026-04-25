-- =============================================
-- CREAR BASE DE DATOS SAAS_PEDIDOS (SINGLE-TENANT / WHITE LABEL)
-- =============================================

CREATE DATABASE IF NOT EXISTS saas_pedidos;
USE saas_pedidos;

-- =============================================
-- TABLA: CONFIGURACION (Antes Empresas)
-- =============================================
CREATE TABLE configuracion (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre_negocio VARCHAR(255) NOT NULL,
    email_contacto VARCHAR(255) NOT NULL,
    telefono_whatsapp VARCHAR(20) NOT NULL,
    logo_url VARCHAR(255),
    color_primario VARCHAR(7) DEFAULT '#000000',
    color_secundario VARCHAR(7) DEFAULT '#ffffff',
    direccion_fisica VARCHAR(255),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    horario_apertura TIME,
    horario_cierre TIME,
    tiempo_promedio_preparacion INT DEFAULT 45, -- en minutos
    permite_entregas BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: USUARIOS
-- =============================================
CREATE TABLE usuarios (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contraseña VARCHAR(255),
    google_id VARCHAR(255),
    telefono VARCHAR(20),
    rol ENUM('admin', 'editor', 'cliente') DEFAULT 'cliente',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_google_id (google_id)
);

-- =============================================
-- TABLA: CATEGORIAS
-- =============================================
CREATE TABLE categorias (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    orden INT DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activa (activa)
);

-- =============================================
-- TABLA: PRODUCTOS
-- =============================================
CREATE TABLE productos (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    categoria_id BIGINT UNSIGNED NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_categoria_id (categoria_id),
    INDEX idx_disponible (disponible)
);

-- =============================================
-- TABLA: DIRECCIONES
-- =============================================
CREATE TABLE direcciones (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
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
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_es_principal (es_principal)
);

-- =============================================
-- TABLA: PEDIDOS
-- =============================================
CREATE TABLE pedidos (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
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
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (created_at)
);

-- =============================================
-- TABLA: ITEMS_PEDIDOS
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
-- TABLA: AUDITORÍA
-- =============================================
CREATE TABLE auditoria (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT UNSIGNED,
    accion VARCHAR(50) NOT NULL, -- crear, actualizar, eliminar
    tabla VARCHAR(50) NOT NULL,
    registro_id BIGINT UNSIGNED,
    cambios JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_fecha (created_at)
);

-- =============================================
-- DATOS DE CONFIGURACIÓN INICIAL (Ejemplo)
-- =============================================
INSERT INTO configuracion (nombre_negocio, email_contacto, telefono_whatsapp, color_primario)
VALUES ('Mi Negocio White Label', 'contacto@minegocio.com', '573000000000', '#FF5733');

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
