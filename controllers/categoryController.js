import Joi from 'joi';
import Category from '../models/categoryModel.js';
import Business from '../models/businessModel.js';

const addCategory = async (req, res) => {
    const categoryValidationSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        businessId: Joi.string().required(),
    });
    const { error, value } = categoryValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        value.userId = req.user.id;
        const business = await Business.findOne({ _id: value.businessId, userId: value.userId })
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        const category = new Category(value);
        const savedcategory = await category.save();
        res.status(201).json(savedcategory);
    } catch (err) {
        console.log("🚀 ~ addCategory ~ err:", err)
        res.status(500).json({ error: err.message });
    }
};

const getCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const business = await Business.findOne({ userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        const categories = await Category.find({ businessId: business._id });
        res.status(200).json(categories);

    } catch (err) {
        console.log("🚀 ~ getCategory ~ err:", err)
        res.status(500).json({ error: err.message });
    }
};

const updateCategory = async (req, res) => {
    const categoryValidationSchema = Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
    });

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { error, value } = categoryValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const business = await Business.findOne({ userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }

        const updateCategory = await Category.updateOne({ _id: id, businessId: business._id }, value);
        res.status(200).json(updateCategory);

    } catch (err) {
        console.log("🚀 ~ updateCategory ~ err:", err);
        res.status(500).json({ error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const business = await Business.findOne({ userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        const deletedCategory = await Category.deleteOne({ _id: id, businessId: business._id });
        if(!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.log("🚀 ~ deleteCategory ~ err:", err);
        res.status(500).json({ error: err.message });
    }
};

export { addCategory, getCategory, updateCategory, deleteCategory };