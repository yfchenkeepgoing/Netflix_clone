import useSWR from 'swr';

import fetcher from '@/lib/fetcher';

// svr: versal developed package, which is good at fetching data
// If the data already exists, we are not going to fetch the data again
const useCurrentUser = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/current', fetcher)

    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useCurrentUser;