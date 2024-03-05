import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // limit to get request
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    // try and catch block
    try {
        await serverAuth(req, res);

        const { movieId } = req.query; // search for movie Id

        if (typeof movieId !== 'string') {
            throw new Error('Invalid ID');
        }

        if (!movieId) {
            throw new Error('Invalid ID');
        }

        // find movie using movieId
        const movie = await prismadb.movie.findUnique({
            where: {
                id: movieId
            }
        });

        if (!movie) {
            throw new Error('Invalid ID');
        }

        return res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}