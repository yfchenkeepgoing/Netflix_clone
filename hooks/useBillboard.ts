import useSWR from "swr";

import fetcher from "@/lib/fetcher";

const useBillboard =() => {
    const { data, error, isLoading } = useSWR('/api/random', fetcher, {
        // static data only load once the user visits the page
        // not every time they lose focus out of the window
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data,
        error,
        isLoading,
    }
}

export default useBillboard;