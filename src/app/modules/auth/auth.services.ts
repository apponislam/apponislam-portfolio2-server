import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { jwtHelper } from "../../../utils/jwtHelper";
import config from "../../config";
import { UserModel } from "./auth.model";
import bcrypt from "bcrypt";

const registerUser = async (data: any) => {
    const existing = await UserModel.findOne({ email: data.email });
    if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Email already in use");

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, Number(config.bcrypt_salt_rounds));

    // Prepare user data
    const userData: any = {
        ...data,
        role: data.role || "GUEST",
        password: hashedPassword,
        isActive: true,
    };

    // Email verification
    // const { token, expiry } = generateVerificationToken(24);
    // userData.verificationToken = token;
    // userData.verificationTokenExpiry = expiry;
    // userData.isEmailVerified = false;

    // Create user
    const createdUser = await UserModel.create(userData);

    // Send verification email

    // Generate JWT tokens
    const jwtPayload = {
        _id: createdUser._id,
        name: createdUser.fullName,
        email: createdUser.email,
        profileImg: createdUser.avatar,
        role: createdUser.role,
    };

    const accessToken = jwtHelper.generateToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expire as string);
    const refreshToken = jwtHelper.generateToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expire as string);

    const { password, ...userWithoutPassword } = createdUser.toObject();

    // setTimeout(() => {
    //     const verificationUrl = `${config.client_url}/verify-email?token=${token}&id=${createdUser._id}`;
    //     sendVerificationEmail({
    //         to: createdUser.email,
    //         name: createdUser.name,
    //         verificationUrl,
    //     }).catch(console.error);
    // }, 0);

    return { user: userWithoutPassword, accessToken, refreshToken };
};

export const authServices = {
    registerUser,
};
