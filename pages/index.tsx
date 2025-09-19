import Head from "next/head";
import MartianMap from "../components/MartianMap";

export default function Home() {
  return (
    <>
      <Head>
        <title>Martian Robot</title>
      </Head>
      <main>
        <h1>Martian Robot</h1>
        <MartianMap />
      </main>
    </>
  );
}
