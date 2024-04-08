import mongoose, {Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";

const emailRegexPatten: RegExp = /^[^$@]+@[^@]+$/;

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    avatar:{
        public_id: string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>;
};

const userSchema: Schema<IUser> = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    email:{
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        match: [emailRegexPatten, "Please Enter Valid Email"],
    validate: {
        validator: function (value: string)  {
            return emailRegexPatten.test(value);
        },
        message: props => `${props.value} is not a valid email`,
    }
    },
    password:{
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false //Hide this field
    },
    avatar:{
        public_id: String,
        url: String,
    },
    role:{
        type: String,
        default: "user",
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    courses:[
        {
            courseId: String,
        }
    ],    
},{timestamps:true});

//Hash Password Before saving

userSchema.pre<IUser>("save", async function (next) {
    if(!this.isModified("password")){
    next();   
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//Compare Password

userSchema.methods.comparePassword = async function (enterPassword: string): Promise<boolean> {
    return await bcrypt.compare(enterPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;