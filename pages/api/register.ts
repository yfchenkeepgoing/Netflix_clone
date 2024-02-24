import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // we only want to allow post calls to /api/register
    }

    // try and catch block
    // try: extract some values from request.body
    try {
        const { email, name, password } = req.body;

        // check if an email is already in use
        const existinguser = await prismadb.user.findUnique({
            where: {
                email,
            }
        });

        // email in use, return Email taken
        if (existinguser) {
            return res.status(422).json({error: 'Email taken'});
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 将user信息存入数据库
        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        });

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}