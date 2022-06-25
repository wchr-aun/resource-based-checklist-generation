import { Information } from "@models";
import Divider from "./Divider";

interface Props {
  information: Information[];
}

function Information(props: Props) {
  const { information } = props;
  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-gray-100">
      {information.map((info, i) => (
        <div className="py-1 px-5" key={i}>
          <div className="mb-2 font-bold text-lg">{info.name}</div>
          <div>
            {[...info.details]
              .sort((a, b) => a.order - b.order)
              .map(
                (details) =>
                  !details.hide && (
                    <div
                      className="flex space-x-2 space-y-2"
                      key={details.name}
                    >
                      <div className="font-semibold w-2/12 flex justify-end self-center">
                        {details.name}:
                      </div>
                      <div className="w-10/12 text-left border rounded-md p-2">
                        Mollit incididunt exercitation quis et fugiat laborum
                        nulla commodo nisi excepteur eu excepteur minim eu.
                        Culpa cupidatat minim incididunt adipisicing nisi
                        voluptate incididunt. Ad commodo veniam nulla aliqua
                        magna ut amet amet ullamco id. Consequat exercitation
                        occaecat adipisicing adipisicing aliqua aliquip ea.
                        Veniam do ad consectetur non esse sint sit consequat
                        proident.
                      </div>
                    </div>
                  )
              )}
          </div>
          {i !== information.length - 1 && <Divider className="mt-2" />}
        </div>
      ))}
    </div>
  );
}

export default Information;
