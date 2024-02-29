// can handle both post request and delete request
// api to add and remove favourite ID into our list
import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // try and catch block
    try {
        // handle post request
        if (req.method === 'POST') {
            const { currentUser } = await serverAuth(req, res); // get curent user

            const { movieId } = req.body; // get movieId

            // check if the movieId is correct
            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!existingMovie) {
                throw new Error('Invalid ID');
            }

            // update user and push movieId to their favoriteIds defined in schema.prisma
            const user = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: {
                        push: movieId,
                    }
                }
            });

            return res.status(200).json(user);
        }

        // handle delete request when a user want to unfavorite a movie
        if (req.method === 'DELETE') {
            const { currentUser } = await serverAuth(req, res);

            const { movieId } = req.body;

            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!existingMovie) {
                throw new Error('Invalid ID');
            }

            // a list of our current favorite IDs without the above movie id
            const updateFavoriteIds = without(currentUser.favoriteIds, movieId);

            // update User information
            const updatedUser = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: updateFavoriteIds,
                }
            });

            return res.status(200).json(updatedUser);
        }

        return res.status(405).end(); 
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}