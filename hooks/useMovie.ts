import useSWR from "swr";
import fetcher from "@/lib/fetcher";

// parameter: id，该id会被/api/movies/[movieId].ts中的[movieId]解析
const useMovie = (id?: string) => {
    const { 
        data, 
        error, 
        isLoading 
    } = useSWR(id ? `/api/movies/${id}` : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    return {
        data,
        error,
        isLoading,
    }
}

export default useMovie;