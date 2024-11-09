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
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          {/* <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1> */}
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Music-Related Career History
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap justify-center">
            {allHistories.map((d) => (
              <div
                key={d._id}
                className="mx-2 my-6 flex min-h-80 w-full max-w-[333px] items-center justify-center rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:w-1/2"
              >
                <div className="p-3 text-center">
                  <div className="mb-4 flex justify-center">
                    <img src={d.image} alt={d.name} className="h-40 w-40 rounded-full" />
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-10 w-10 text-purple-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                      />
                    </svg> */}
                  </div>
                  <div className="mb-2 flex justify-center">
                    <h5 className="text-2xl font-semibold text-slate-800">{d.name}</h5>
                  </div>
                  <p className="mb-4 block max-w-lg font-light leading-normal text-slate-600">
                    {d.summary}
                  </p>
                  <div className="text-center">
                    <Link href={`/history/${d.slug}`}>
                      <button
                        className="min-w-32 rounded-md border border-transparent bg-slate-800 px-4 py-2 text-center text-sm text-white shadow-md transition-all hover:bg-slate-700 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 active:shadow-none"
                        type="button"
                      >
                        View More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
}
