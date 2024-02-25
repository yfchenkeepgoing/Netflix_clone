import { NextPageContext } from "next";
import { getSession, signOut } from "next-auth/react";

import useCurrentUser from "@/hooks/useCurrentUser";

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
  const { data : user } = useCurrentUser();

  return (
    <>
      <h1 className="text-4xl text-green-500">Netflix Clone</h1>
      <p className="text-white">Logged in as : {user?.email}</p>
      <button className="h-10 w-full bg-white" onClick={() => signOut()}>Logout!</button>
    </>
  );
}
