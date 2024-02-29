import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    // limit this route only to get method
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    // try and catch block
    try {
        const { currentUser } = await serverAuth(req);

        // find all movies which have a relation to current user favorite IDs
        const  favoriteMovies  = await prismadb.movie.findMany({
            where: {
                id: {
                    in: currentUser?.favoriteIds,
                }
            }
        });

        return res.status(200).json(favoriteMovies);
        
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}