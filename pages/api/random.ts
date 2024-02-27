// random movie will be loaded every time we refresh the page
import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // limit request method to GET
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    // try and catch block
    try {
        // check if the user log in
        await serverAuth(req);

        const movieCount = await prismadb.movie.count();
        const randomIndex = Math.floor(Math.random() * movieCount); // a random integar

        const randomMovies = await prismadb.movie.findMany({
            take: 1,
            skip: randomIndex
        });

        return res.status(200).json(randomMovies[0]); // take only one movies
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    };
}