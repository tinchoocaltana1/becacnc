const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// get all products
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY product_id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// get all products by order_id
router.get('/:orderId', authMiddleware, async (req, res) => {
    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId)) {
        return res.status(400).json({ message: 'Invalid order_id' });
    }

    try {
        const result = await pool.query('SELECT * FROM products WHERE order_id = $1 ORDER BY product_id', [orderId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products by order_id:', error);
        res.status(500).json({ message: 'Error fetching products by order_id' });
    }
});

// toggle status of a product by id
router.patch('/:productId', authMiddleware, async (req, res) => {
    const { productId } = req.params;

    try {
        const getIsDoneQuery = `
            SELECT is_done FROM products 
            WHERE product_id = $1
        `;

        const getResult = await pool.query(getIsDoneQuery, [productId]);

        if (getResult.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const currentStatus = getResult.rows[0].is_done;

        if (currentStatus === null || currentStatus === undefined) {
            return res.status(400).json({ message: 'Product status is already null or undefined' });
        }

        const is_done = !currentStatus; // toggle the is_done status
        console.log(`Toggling product ${productId} status to ${is_done}`);

        const updateQuery = `
            UPDATE products 
            SET is_done = $1 
            WHERE product_id = $2
        `;

        const result = await pool.query(updateQuery, [is_done, productId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product status updated successfully' });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ message: 'Error updating product status' });
    }
});

// delete a product by id
router.delete('/:productId', authMiddleware, async (req, res) => {
    const { productId } = req.params;

    try {
        const deleteQuery = `
            DELETE FROM products 
            WHERE product_id = $1
        `;

        const result = await pool.query(deleteQuery, [productId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;