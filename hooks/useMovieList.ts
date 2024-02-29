import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useMovieList = () => {
    const { data, error, isLoading }  = useSWR('api/movies', fetcher, {
        // 不需要重新验证
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data,
        error,
        isLoading
    }
};

export default useMovieList;