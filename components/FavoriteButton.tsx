import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
    movieId: string;
}

// only one parameter: movieId
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
    const { mutate: mutateFavorites } = useFavorites();
    const { data: currentUser, mutate } = useCurrentUser();

    // check if the favorite list of current user includes movieId
    const isFavorite = useMemo (() => {
        const list = currentUser?.favoriteIds || [];

        return list.includes(movieId);
    }, [currentUser, movieId]); // dependency in []

    // once we click the favorite, we will check if the current movie is favorited
    // if yes, trigger the delete request
    // if no, add the movie in the favorite list
    const toggleFavorites = useCallback(async () => {
        let response;

        if (isFavorite) {
            response = await axios.delete('/api/favorite', { data: { movieId } });
        } else {
            response = await axios.post('/api/favorite', { movieId });
        }

        // update the favorite list of current user
        const updatedFavoriteIds = response?.data?.favoriteIds;

        // mutate用于更新currentUser数据
        mutate({
            ...currentUser, // 复制了currentUser对象中的所有属性到一个新对象中
            // 如果currentUser对象中已经存在favoriteIds属性，这一操作将会覆盖原有的值。如果不存在，就会添加一个新的favoriteIds属性
            favoriteIds: updatedFavoriteIds,
        });

        mutateFavorites(); // 来自useFavorites中的mutate，每次更新currentUser的favoriteIds的数据后，立即刷新
    }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

    return (
        <div 
            onClick={toggleFavorites}
        className="
            cursor-pointer
            group/item
            w-6
            h-6
            lg:w-10
            lg:h-10
            border-white
            border-2
            rounded-full
            flex
            justify-center
            items-center
            transition
            hover:border-neutral-300
        ">
            <Icon className="text-white" size ={25} />
        </div>
    )
}

export default FavoriteButton;