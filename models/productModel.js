import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {

        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },

        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },

        name: {
            type: String,
            required: true,
            unique: true,
        },

        description: {
            type: String,
            required: true,
        },

        barCode: {
            type: String,
            required: true,
        },

        costPrice: {
            type: Number,
            required: true,
        },

        salePrice: {
            type: Number,
            required: true,
        },

        discountPercentage: {
            type: Number,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
        packingMode: {
            type: String,
            required: true,
        },
        reOrderLevel: {
            type: Number,
            required: true,
        },
        batchNo: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },

    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
