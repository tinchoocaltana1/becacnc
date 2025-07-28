const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// create new order with its products
router.post('/', authMiddleware, async (req, res) => {
    const { client_name, products } = req.body;

    if (!client_name || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Invalid order data or products' });
    }

    let orderIdForError = null;

    try {
        // 1- calculate total cost and price // created_at date
        let total_cost = 0;
        let total_price = 0;

        products.forEach(product => {
            const cost = Number(product.unit_cost);
            const price = Number(product.unit_price);
            const quantity = Number(product.quantity);

            if (isNaN(cost) || isNaN(price) || isNaN(quantity)) {
                throw new Error('Invalid product data: non-numeric values');
            }

            total_cost += cost * quantity;
            total_price += price * quantity;
        });

        const createdAt = new Date();

        // 2- insert order into the database
        const db = pool;

        const insertOrderQuery = `
            INSERT INTO orders (client_name, created_at, completed_at, status, total_cost, total_price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING order_id
        `;

        const insertOrderValues = [
            client_name,
            createdAt,
            null, // completed_at is null for new orders
            'pending', // default status
            total_cost,
            total_price
        ];

        const orderResult = await db.query(insertOrderQuery, insertOrderValues);

        const orderId = orderResult.rows[0].order_id;
        orderIdForError = orderId; // save order ID for error handling

        // 3- insert products into the database
        const insertProductQuery = `
            INSERT INTO products (description, size, quantity, unit_cost, unit_price, is_done, order_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        for (const product of products) {
            await db.query(insertProductQuery, [
                product.description || '',
                product.size || '',
                product.quantity,
                product.unit_cost,
                product.unit_price,
                false,
                orderId
            ]);
        }

        res.status(201).json({ message: 'Order and products created successfully', orderId });
    } catch (error) {
        if (orderIdForError != null) {
            // delete the order if it was created
            try {
                const db = pool;
                await db.query('DELETE FROM orders WHERE order_id = $1', [orderIdForError]);
            } catch (deleteError) {
                console.error('Error deleting order after failure:', deleteError);
            }
        }  

        console.error('Server error - creating order or products:', error);
        return res.status(500).json({ message: 'Error creating order or products', orderId: orderIdForError });
    }
});

// get all orders with completion percentage
router.get('/', authMiddleware, async (req, res) => {
    try {
        const db = pool;

        // get all orders
        const ordersResult = await db.query('SELECT * FROM orders');
        const orders = ordersResult.rows;

        // process each order to calculate the completion percentage
        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
                // get the products for each order
                const productsResult = await db.query('SELECT is_done FROM products WHERE order_id = $1', [order.id]);
                const products = productsResult.rows;

                const totalProducts = products.length; // number of products
                const doneProducts = products.filter(p => p.is_done).length; // number of done products

                // calculate completion percentage (if no products, percentage is 0; otherwise, round to nearest integer)
                const completionPercentage = totalProducts === 0 ? 0 : Math.round((doneProducts / totalProducts) * 100);

                return {
                    ...order,
                    completion_percentage: completionPercentage,
                };
            })
        );

        res.json(enrichedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// get pending orders
router.get('/pending', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders WHERE status = $1', ['pending']);
        const enriched = await enrichOrdersWithCompletion(result.rows);
        res.json(enriched);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching pending orders' });
    }
});

// get completed orders
router.get('/completed', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders WHERE status = $1', ['completed']);
        const enriched = await enrichOrdersWithCompletion(result.rows);
        res.json(enriched);
    } catch (error) {
        console.error('Error fetching completed orders:', error);
        res.status(500).json({ message: 'Error fetching completed orders' });
    }
});

// get order by id
router.get('/:order_id', authMiddleware, async (req, res) => {
    const orderId = parseInt(req.params.order_id, 10);
    if (isNaN(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const db = pool;
        const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const productsResult = await db.query('SELECT * FROM products WHERE order_id = $1', [orderId]);

        res.json({
            order: orderResult.rows[0],
            products: productsResult.rows
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

// update order status
router.patch('/:order_id', authMiddleware, async (req, res) => {
    const orderId = parseInt(req.params.order_id, 10);

    if (isNaN(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const db = pool;
        const updateOrderQuery = `
            UPDATE orders
            SET status = $1, completed_at = $2
            WHERE order_id = $3
        `;

        const completedAt = new Date();

        const updateProductsQuery = `
            UPDATE products
            SET is_done = TRUE
            WHERE order_id = $1
        `;
        await db.query(updateProductsQuery, [orderId]);
        await db.query(updateOrderQuery, ['completed', completedAt, orderId]);

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

// delete order by id
router.delete('/:order_id', authMiddleware, async (req, res) => {
    const orderId = parseInt(req.params.order_id, 10);
    if (isNaN(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const db = pool;
        const deleteOrderQuery = 'DELETE FROM orders WHERE order_id = $1';
        const deleteProductsQuery = 'DELETE FROM products WHERE order_id = $1';

        await db.query(deleteProductsQuery, [orderId]);
        await db.query(deleteOrderQuery, [orderId]);

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
});

// helper to enrich orders with completion percentage
const enrichOrdersWithCompletion = async (orders) => {
    return await Promise.all(
        orders.map(async (order) => {
            const productsResult = await pool.query('SELECT is_done FROM products WHERE order_id = $1', [order.order_id]);
            const products = productsResult.rows;

            const totalProducts = products.length;
            const doneProducts = products.filter(p => p.is_done).length;
            const completionPercentage = totalProducts === 0 ? 0 : Math.round((doneProducts / totalProducts) * 100);

            return {
                ...order,
                completion_percentage: completionPercentage,
            };
        })
    );
};

module.exports = router;