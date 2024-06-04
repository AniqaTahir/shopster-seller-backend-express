import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
    {
        businessId: {
            type: Number,
        },
        ownerName: {
            type: String,
            required: true,
        },

        ownerCnic: {
            type: String,
            required: true,
            unique: true,
        },

        ownerDob: {
            type: String,
            required: true,
        },
        ownerPic: {
            type: String,
            required: true,
        },
        businessContact1: {
            type: String,
            required: true,
            unique: true,
        },
        businessContact2: {
            type: String,
            required: true,
            unique: true,
        },
        businessAddress: {
            type: String,
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            }
        },
        businessLogo: {
            type: String,
            required: true,
        },
        tagline: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        cnicFrontPicture: {
            type: String,
            required: true,
        },
        cnicBackPicture: {
            type: String,
            required: true,
        },
        accountNumber: {
            type: String,
            required: true,
            unique: true,
        },
        accountType: {
            type: String,
            required: true,
        },
        bankDetail: {
            type: String,
            required: true,
        },
        isPending: {
            type: Boolean,
            default: false,
        },
        comments: {
            type: String,
            default: "",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },

    { timestamps: true }
);

businessSchema.index({ location: '2dsphere' });
businessSchema.pre('save', async function (next) {
    if (!this.isNew) {
        next();
        return;
    }

    try {
        const lastBusiness = await Business.findOne({}, {}, { sort: { 'businessId': -1 } });
        if (lastBusiness) {
            this.businessId = lastBusiness.businessId + 1;
        } else {
            this.businessId = 1;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Business = mongoose.model('Business', businessSchema);

export default Business;
