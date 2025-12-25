import projectsData from "@/data/projectsData";
import { History, allHistories } from "contentlayer/generated";
import Card from "@/components/Card";
import { genPageMetadata } from "@/app/seo";
import Link from "@/components/Link";

export const metadata = genPageMetadata({ title: "History" });

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Music-Related Career History
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex w-full flex-wrap justify-center">
            {allHistories.map((d) => (
              <div
                key={d._id}
                className="flex min-h-[380px] w-full max-w-[333px] flex-col items-center justify-between gap-4 p-4 shadow-xs sm:flex-col md:w-1/2 md:flex-row"
              >
                <a
                  key={d._id}
                  href={`/history/${d.slug}`}
                  className="flex h-full w-full justify-center"
                >
                  <div className="group my-6 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-3 shadow-xs transition-shadow duration-300 hover:shadow-lg">
                    <div className="m-2.5 h-40 max-h-[300px] w-40 overflow-hidden rounded-full text-white">
                      <img
                        src={d.image}
                        alt={d.name}
                        className="ease-[cubic-bezier(0.25, 1, 0.5, 1)] m-0 transform object-contain object-center transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="mb-2 flex justify-center">
                      <h5 className="text-2xl font-semibold text-slate-800">{d.name}</h5>
                    </div>
                    <p className="mb-4 block max-w-lg leading-normal font-light text-slate-600">
                      {d.summary}
                    </p>
                    <div className="text-center">
                      <button
                        className="min-w-32 rounded-md border border-transparent bg-slate-800 px-4 py-2 text-center text-sm text-white shadow-md transition-all hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 active:shadow-none"
                        type="button"
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
