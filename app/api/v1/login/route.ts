// import dbConnect from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export const POST = async (request: Request) => {
//   try {
//     await dbConnect();
//     const { email, password } = await request.json();
//     const userExist = await User.findOne({ email });
//     if (!userExist)
//       return NextResponse.json({ message: "User not found" }, { status: 401 });
//     const isPasswordMatched = bcrypt.compare(password, userExist.password);
//     if (!isPasswordMatched)
//       return NextResponse.json(
//         { message: "Invalid credentials" },
//         { status: 401 }
//       );
//     const token = jwt.sign(
//       { id: userExist._id, email: userExist.email },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1d" }
//     );
//     const response = NextResponse.json(
//       {
//         message: "Welcome back",
//         user: userExist,
//       },
//       { status: 200 }
//     );
//     response.cookies.set("token", token, {
//       httpOnly: true,
//       path: "/",
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };

// Placeholder export to make this a valid module
export {};
