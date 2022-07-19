import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function EvaluationDone() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();
  useEffect(() => {
    if (countdown < 0) return;
    setTimeout(() => {
      setCountdown(countdown - 1);
      if (countdown === 0) {
        router.push("/");
      }
    }, 1000);
  }, [countdown]);
  return (
    <div className="text-center py-5 bg-white border border-transparent rounded-lg">
      <Head>
        <title>Evaluation Done - Resource-based Checklist Generation</title>
      </Head>
      <div className="text-4xl">DONE!</div>
      <div className="mb-20">Thank you for your time!</div>
      Back to Main Screen in {countdown} seconds
      <br />
      OR
      <div className="underline">
        <Link href="/">Click Here</Link>
      </div>
    </div>
  );
}

export default EvaluationDone;
