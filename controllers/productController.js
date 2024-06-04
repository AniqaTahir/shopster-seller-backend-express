import Joi from 'joi';
import Category from '../models/categoryModel.js';
import Business from '../models/businessModel.js';
import Product from '../models/productModel.js';

const addProduct = async (req, res) => {
    const productValidationSchema = Joi.object({
        businessId: Joi.string().required(),
        categoryId: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        barCode: Joi.string().required(),
        costPrice: Joi.number().required(),
        salePrice: Joi.number().required(),
        discountPercentage: Joi.number().required(),
        brand: Joi.string().required(),
        qty: Joi.number().required(),
        packingMode: Joi.string().required(),
        reOrderLevel: Joi.number().required(),
        batchNo: Joi.number().required(),
        isActive: Joi.boolean().default(true),
    });
    const { error, value } = productValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const userId = req.user.id;
        const business = await Business.findOne({ _id: value.businessId, userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        const category = await Category.findOne({ _id: value.categoryId, businessId: business._id });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        const product = new Product(value);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.log("🚀 ~ addProduct ~ err:", err);
        res.status(500).json({ error: err.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const business = await Business.findOne({ userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        const products = await Product.find({ businessId: business._id });
        res.status(200).json(products);

    } catch (err) {
        console.log("🚀 ~ getProduct ~ err:", err)
        res.status(500).json({ error: err.message });
    }
};

const updateProduct = async (req, res) => {
    const productValidationSchema = Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        barCode: Joi.string().optional(),
        costPrice: Joi.number().optional(),
        salePrice: Joi.number().optional(),
        discountPercentage: Joi.number().optional(),
        brand: Joi.string().optional(),
        qty: Joi.number().optional(),
        packingMode: Joi.string().optional(),
        reOrderLevel: Joi.number().optional(),
        batchNo: Joi.number().optional(),
        isActive: Joi.boolean().optional(),
    });

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { error, value } = productValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const business = await Business.findOne({ userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }

        const updateProduct = await Product.updateOne({ _id: id, businessId: business._id }, value);
        res.status(200).json(updateProduct);

    } catch (err) {
        console.log("🚀 ~ updateProduct ~ err:", err);
        res.status(500).json({ error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const business = await Business.findOne({ userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        const deletedProduct = await Product.deleteOne({ _id: id, businessId: business._id });
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.log("🚀 ~ deleteProduct ~ err:", err);
        res.status(500).json({ error: err.message });
    }
};

export { addProduct, getProduct, updateProduct, deleteProduct };