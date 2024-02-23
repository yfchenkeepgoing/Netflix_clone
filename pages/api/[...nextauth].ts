import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

import prismadb from '@/lib/prismadb';

export default NextAuth({
    providers: [
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }
                
                // 通过email找到用户，需要import prismadb
                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                // 判断找到的user是否存在
                if (!user || !user.hashedPassword) {
                    throw new Error('Email does not exist');
                }

                // 判断用户输入的密码是否正确
                const isCorrectPassword = await compare(
                    credentials.password, 
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error("Incorrect password"); 
                }

                return user; // 用户密码输入正确，则返回由email找到的唯一user
            }
        })
    ],

    pages: {
        signIn: '/auth',
    },
    // debug on
    debug: process.env.NODE_ENV === 'development',

    session: {
        strategy: 'jwt',
        
    },
})