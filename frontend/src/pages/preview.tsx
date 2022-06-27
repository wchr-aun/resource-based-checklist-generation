import store from "@app/store";
import Checklist from "@components/Checklist";
import Divider from "@components/Divider";
import InformationComponent from "@components/Information";
import { faAngleLeft, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

const Preview: NextPage = () => {
  const form = store.getState().form;
  if (form.processName === "" && form.components.length === 0) {
    return <div>Nothing to Preview</div>;
  }
  const information = form.information.filter((v) =>
    v.details.some((d) => !d.hide)
  );

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div className="space-y-2 mb-8">
      <div
        className={`fixed rounded-full px-5 py-4 bg-white origin-bottom-left right-5 bottom-5 shadow-md cursor-pointer ${
          scrolled ? "" : "hidden"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FontAwesomeIcon icon={faAngleUp} size="lg" />
      </div>
      <Head>
        <title>
          Preview: {form.processName} - Resource-based Checklist Generation
        </title>
      </Head>
      <div className="flex space-x-2 py-5 bg-white justify-center rounded-lg border border-indigo-200">
        <div className="lg:text-4xl font-bold">{form.processName}</div>
        <div className="flex self-end italic text-sm">(Preview)</div>
      </div>
      <Divider />
      {information.length !== 0 && <div>Information</div>}
      {information.length !== 0 && (
        <div>
          <InformationComponent information={information} />
          <Divider />
        </div>
      )}
      <div>Form</div>
      <Checklist checklist={form.components} />
    </div>
  );
};

export default Preview;
