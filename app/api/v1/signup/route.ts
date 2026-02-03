// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// export const POST = async (request: Request) => {
//   try {
//     await dbConnect();
//     const { fullName, email, password } = await request.json();
//     const userExist = await User.find({ email });
//     console.log("-----");
//     console.log(userExist);
//     //user already present
//     if (userExist.length > 0) {
//       return NextResponse.json(
//         {
//           error: "User Already exist",
//         },
//         { status: 401 }
//       );
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newUser = await User.create({
//       fullName,
//       email,
//       password: hashedPassword,
//     });
//     const token = jwt.sign(
//       { id: newUser._id, email: newUser.email },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1d" }
//     );
//     console.log(newUser);
//     const response = NextResponse.json(
//       {
//         message: "User created Successfull",
//         user: newUser,
//       },
//       { status: 200 }
//     );
//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//       path: "/",
//     });
//     return response;
//   } catch (error) {
//     console.log("error");
//   }
// };

// Placeholder export to make this a valid module
export {};
