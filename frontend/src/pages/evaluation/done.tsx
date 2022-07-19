import Link from "next/link";

function EvaluationDone() {
  return (
    <div className="text-center py-5 bg-white border border-transparent rounded-lg">
      <div className="text-4xl">DONE!</div>
      <div className="mb-20">Thank you for your time!</div>
      <div className="underline">
        <Link href="/">Back to Main Screen</Link>
      </div>
    </div>
  );
}

export default EvaluationDone;
