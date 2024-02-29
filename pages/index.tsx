import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import Navbar from "@/components/Navbar";
import useFavorites from "@/hooks/useFavorites";
import useMovieList from "@/hooks/useMovieList";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

// fetch our session from client side
// cannot use serverAuth
export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  // session不存在，则返回登录界面
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  // session存在，则返回空
  return {
    props: {}
  }
}

export default function Home() {
  const { data: movies = [] } = useMovieList(); // use the newly created hook
  const { data: favorites = [] } = useFavorites(); // use hook to get favorite movies
  
  return (
    <>
      <Navbar />
      <Billboard />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  );
}
