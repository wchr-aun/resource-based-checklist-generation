import { Information } from "@models";
import Divider from "./Divider";

interface Props {
  information: Information[];
}

function Information(props: Props) {
  const { information } = props;
  return (
    <div className="p-5 border border-indigo-200 rounded-lg bg-white">
      {information.map((info, i) => (
        <div className="py-1 px-5" key={i}>
          <div className="mb-2 font-bold text-lg">{info.name}</div>
          <div>
            {[...info.details]
              .sort((a, b) => a.order - b.order)
              .map(
                (details, j) =>
                  !details.hide && (
                    <div className="flex space-x-2 mb-3" key={j}>
                      <div className="font-semibold w-2/12 flex justify-end self-center">
                        {details.array && "["}
                        {details.name}
                        {details.array && "]"}
                      </div>
                      <div className="w-10/12 text-left border rounded-md p-2 text-sm">
                        -
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
