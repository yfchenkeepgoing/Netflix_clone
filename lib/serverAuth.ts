import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react'; 

import prismadb from '@/lib/prismadb';

const serverAuth = async (req: NextApiRequest) => {
    // fetch log in user session
    const session = await getSession({ req });

    // use serverAuth in api controller
    // req parameter  will hold jwt token to get logged in user
    // use session to get other fields
    if (!session?.user?.email) { // if session or user or email does not exist, throw new error
        throw new Error('Not signed in');
    }

    // 通过email找到不同的user
    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email,
        }
    });

    // 无currentUser, 说明jwt token或者session不正确或者过期了
    if (!currentUser) {
        throw new Error('Not signed in');
    }

    return { currentUser };
};

export default serverAuth;