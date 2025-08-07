-- Orders table (core entity)

CREATE TABLE orders (

    order_id BIGINT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    restaurant_id BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL CHECK (status IN (

        'PENDING', 'ACCEPTED', 'DECLINED',

        'IN_COOKING', 'OUT_FOR_DELIVERY',

        'COMPLETED', 'CANCELLED'

    )),

    total_amount DECIMAL(10, 2) NOT NULL,

    order_time TIMESTAMP NOT NULL,

    delivery_time TIMESTAMP,

    delivery_address TEXT NOT NULL,

    payment_id BIGINT,

    delivery_agent_id BIGINT,

    idempotency_key VARCHAR(255) UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    delivery_id BIGINT UNIQUE

);

-- Order items (1:N relationship with orders)

CREATE TABLE order_items (

    id BIGINT PRIMARY KEY,

    order_id BIGINT NOT NULL,

    menu_item_id BIGINT NOT NULL,

    item_name VARCHAR(255) NOT NULL,

    quantity INTEGER NOT NULL CHECK (quantity > 0),

    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE

);

-- Cart (user's temporary storage)

CREATE TABLE carts (

    id BIGINT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    restaurant_id BIGINT

);

-- Cart items (1:N relationship with carts)

CREATE TABLE cart_items (

    id BIGINT PRIMARY KEY,

    cart_id BIGINT NOT NULL,

    menu_item_id BIGINT NOT NULL,

    item_name VARCHAR(255) NOT NULL,

    quantity INTEGER NOT NULL CHECK (quantity > 0),

    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),

    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE

);
