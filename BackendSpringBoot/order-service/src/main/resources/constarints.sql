-- Optimize frequent queries

CREATE INDEX idx_orders_user_id ON orders(user_id);

CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);

CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_carts_user_id ON carts(user_id);

-- Add NOT NULL constraints (if missing)

ALTER TABLE carts ALTER COLUMN restaurant_id SET NOT NULL;

-- Add check for delivery time (must be after order time)

ALTER TABLE orders ADD CONSTRAINT chk_delivery_time

    CHECK (delivery_time IS NULL OR delivery_time >= order_time);
