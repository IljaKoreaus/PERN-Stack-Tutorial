import {sql} from "../config/db.js";

// CRUD OPERATIONS FOR BACKEND
export const getProducts = async (req, res) => {

    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `;

        console.log("Fetched products");
        res.status(200).json({success:true, data: products});
    } catch (error) {

        console.log("Error with getProducts function", error);
        res.status(500).json({success:false, message: "Internal Server Error"});
        
    }
    
};

export const createProduct = async (req, res) => {
    const {name, price, image} = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({success:false, message: "All fields are required"});
    }

    try {
        const newProduct = await sql`
            INSERT INTO products (name, price, image)
            VALUES (${name},${price},${image})
            RETURNING *
        `;

        console.log(`New product has been added: ${newProduct}`, newProduct);
        res.status(201).json({success:true, data: newProduct[0]});

    } catch (error) {

        console.log("Error with createProduct function", error);
        res.status(500).json({success:false, message: "Internal Server Error"});
    }
};

export const getProduct = async (req, res) => {
    const {id} = req.params;

    try {
        const product = await sql`
            SELECT * FROM products
            WHERE id = ${id}
        `;

        console.log("Fetched product");
        res.status(200).json({success:true, data: product[0]});

    } catch (error) {

        console.log("Error with getProduct function", error);
        res.status(500).json({success:false, message: "Internal Server Error"});
        
    }
};

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, price, image} = req.body;

    try {
        const updatedProduct = await sql`
            UPDATE products
            SET name = ${name}, price = ${price}, image = ${image}
            WHERE id = ${id}
            RETURNING *
        `;

        // IF PRODUCT NOT FOUND
        if (updateProduct.length === 0) {
            res.status(404).json({
                success:false,
                message: "Product not found"
            });
        }

        console.log("Fetched product");
        res.status(200).json({success:true, data: updatedProduct[0]});

    } catch (error) {

        console.log("Error with updateProduct function", error);
        res.status(500).json({success:false, message: "Internal Server Error"});
        
    }
};

export const deleteProduct = async (req, res) => {

    const {id} = req.params;

    try {
        const deletedProduct = await sql`
            DELETE FROM products
            WHERE id = ${id}
            RETURNING *
        `;

        // IF PRODUCT NOT FOUND
        if (deleteProduct.length === 0) {
            res.status(404).json({
                success:false,
                message: "Product not found"
            });
        }
        
        console.log("Deleted product");
        res.status(200).json({success:true, data: deletedProduct[0]});

    } catch (error) {

        console.log("Error with deleteProduct function", error);
        res.status(500).json({success:false, message: "Internal Server Error"});
        
    }
};