import Joi from 'joi';
import Business from '../models/businessModel.js';
import Product from '../models/productModel.js';

const searchProducts = async (req, res) => {
    const productValidationSchema = Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        search: Joi.string().optional()
    });

    const { error, value } = productValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { lat, lng } = value;
    const radius = 10 / 6378.1;

    try {
        const businesses = await Business.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radius]
                }
            }
        }).select('_id');
        if (businesses.length === 0) {
            res.status(200).json(businesses);
        }
        const businessIds = businesses.map(business => business._id);
        let whereCondition = {
            businessId: { $in: businessIds }
        }
        if (value.search) {
            whereCondition = {
                ...whereCondition,
                name: { $regex: value.search, $options: 'i' }
            }
        }
        const products = await Product.find(whereCondition)
            .populate('businessId', 'businessId businessContact1 businessContact2 businessAddress location businessLogo city district province comments')
            .populate('categoryId', 'name description');
        res.status(200).json(products);

    } catch (err) {
        console.log("🚀 ~ searchProducts ~ err:", err);
        res.status(500).json({ error: err.message });
    }
};
export { searchProducts };