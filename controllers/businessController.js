import Joi from 'joi';
import Business from '../models/businessModel.js';

const addBusiness = async (req, res) => {
    const businessValidationSchema = Joi.object({
        ownerName: Joi.string().required(),
        ownerCnic: Joi.string().required().length(13).regex(/^\d+$/),
        ownerDob: Joi.date().required(),
        ownerPic: Joi.string().required(),
        businessContact1: Joi.string().required(),
        businessContact2: Joi.string().required(),
        businessAddress: Joi.string().required(),
        location: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }).required(),
        businessLogo: Joi.string().required(),
        tagline: Joi.string().allow(''),
        city: Joi.string().required(),
        district: Joi.string().required(),
        province: Joi.string().required(),
        cnicFrontPicture: Joi.string().required(),
        cnicBackPicture: Joi.string().required(),
        accountNumber: Joi.string().required(),
        accountType: Joi.string().required(),
        bankDetail: Joi.string().required(),
        isPending: Joi.boolean().default(false),
        comments: Joi.string().allow('').default(''),
    });
    const { error, value } = businessValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    value.userId = req.user.id;
    const alreadyExist = await Business.findOne({ userId: value.userId });
    if (alreadyExist) {
        return res.status(400).json({ error: "Unable to add business" });
    }
    const business = new Business(value);

    try {

        const savedBusiness = await business.save();
        res.status(201).json(savedBusiness);
    } catch (err) {
        console.log("🚀 ~ addBusiness ~ err:", err)
        res.status(500).json({ error: err.message });
    }
};

const getBusiness = async (req, res) => {
    try {
        const userId = req.user.id;
        const business = await Business.findOne({ userId });
        res.status(200).json(business);
    } catch (err) {
        console.log("🚀 ~ getBusiness ~ err:", err)
        res.status(500).json({ error: err.message });
    }
};

const updateBusiness = async (req, res) => {
    const businessValidationSchema = Joi.object({
        ownerName: Joi.string().optional(),
        ownerCnic: Joi.string().length(13).regex(/^\d+$/).optional(),
        ownerDob: Joi.date().optional(),
        ownerPic: Joi.string().optional(),
        businessContact1: Joi.string().optional(),
        businessContact2: Joi.string().optional(),
        businessAddress: Joi.string().optional(),
        location: Joi.object({
            type: Joi.string().valid('Point').optional(),
            coordinates: Joi.array().items(Joi.number()).length(2).optional(),
        }).optional(),
        businessLogo: Joi.string().optional(),
        tagline: Joi.string().allow('').optional(),
        city: Joi.string().optional(),
        district: Joi.string().optional(),
        province: Joi.string().optional(),
        cnicFrontPicture: Joi.string().optional(),
        cnicBackPicture: Joi.string().optional(),
        accountNumber: Joi.string().optional(),
        accountType: Joi.string().optional(),
        bankDetail: Joi.string().optional(),
        isPending: Joi.boolean().default(false).optional(),
        comments: Joi.string().allow('').default('').optional(),
    });

    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { error, value } = businessValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const business = await Business.findOne({ _id: id, userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }

        const updatedBusiness = await Business.updateOne({ _id: id }, value);
        res.status(200).json(updatedBusiness);

    } catch (err) {
        console.log("🚀 ~ updateBusiness ~ err:", err);
        res.status(500).json({ error: err.message });
    }
};

const deleteBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const business = await Business.findOneAndDelete({ _id: id, userId });
        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }
        res.status(200).json({ message: "Business deleted successfully" });
    } catch (err) {
        console.log("🚀 ~ deleteBusiness ~ err:", err);
        res.status(500).json({ error: err.message });
    }
};

export { addBusiness, getBusiness, updateBusiness, deleteBusiness };