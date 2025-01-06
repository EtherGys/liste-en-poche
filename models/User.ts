
const UserSchema = new Schema({
    user_email: {
        type: String,
        unique: [true, 'Cet email est déjà renseigné'],
        required: [true, "L'email est obligatoire"]
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est obligatoire"]

    },
    user_firstname: {
        type: String,
        required: [true, "Le prénom est obligatoire"],
    },
    user_lastname: {
        type: String,
        required: [true, "Le nom est obligatoire"],
    },
    user_telephone: {
        type: String,
        required: [true, "Le numéro de téléphone est obligatoire"],
    },
    user_subscription: {
        type: String,
    },
    user_birthdate: {
        type: Date,
    },
    user_profession: {
        type: String,
    },
    user_address: {
        type: String,
    },
    token: {
        type: String,
    },
    validity: {
        type: Boolean,
        default: false
    },
    bookmarks: {
            type: [Schema.Types.ObjectId], 
            ref: 'Hotel'
    }
},
    {
        timestamps: true
    })

const User = models.User || model("User", UserSchema);

export default User;