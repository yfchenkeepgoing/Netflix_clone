import Navbar from "@/components/Navbar";
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

  return (
    <>
      <Navbar />
    </>
  );
}
