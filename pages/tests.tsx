import { useEffect, useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import { withIronSessionSsr } from "iron-session/next";

// write an interface for globalThis
declare global {
    interface Window {
        test: any;
        mint: any;
    }
}

const Tests = ({ data } : { data: any }) => {

  const [counter, setCounter] = useState(data);

  useEffect(() => {
    console.log("counter:", counter);
  }, [counter])

  return (
    <>

    Counter: { JSON.stringify(counter) } <br/><br/>

    <button onClick={async () => {
      const login = await fetch('/api/sessions/login').then((res) => res.json());
      const status = await fetch('/api/sessions/status').then((res) => res.json());

      setCounter(status);
    }}>Login</button>
    <br/><br/>
    <button onClick={async () => {
      const logout = await fetch('/api/sessions/logout').then((res) => res.json());
      const status = await fetch('/api/sessions/status').then((res) => res.json());

      setCounter(status);
    }}>Logout</button>
    <br/><br/>
    <button onClick={async () => {
      const status = await fetch('/api/sessions/status').then((res) => res.json());
      setCounter(status);
    }}>Status</button>
    </>
  );
};
export default Tests;


Tests.getLayout = function getLayout(page: any) {
  
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}

// tests.getInitialProps = async (ctx: any) => {

//   console.log("ctx:", ctx);

//   return {}
// }

// export async function getServerSideProps(context: any) {
//   // Fetch data from an API
//   // const res = await fetch(`https://api.example.com/data`)
//   // const data = await res.json()
//   console.log("Testing!!!");
//   // Pass data to the page via props
//   return { props: { data: '222' } }
// }

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {

    // @ts-ignore
    console.log(req.session.logged);

    return {
      props: {
        data: req.session
      },
    };
  },
  {
    cookieName: "is_logged",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
);