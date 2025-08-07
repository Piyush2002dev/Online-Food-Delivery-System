CREATE TABLE Payment (
    id_payment INT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT,
    payment_method ENUM('Card', 'Cash', 'Online'),
    payment_amount DECIMAL(10,2),
    payment_status ENUM('Success', 'Pending', 'Failed'),
    created_by VARCHAR(50),
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    updated_on DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);