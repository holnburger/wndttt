import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Index() {
  const { data, error } = useSWR("/api/random/formated", fetcher);

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md">
          <div className="text-2xl text-red-500">Failed to load</div>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md">
          <div className="animate-pulse text-2xl text-gray-600"></div>
        </div>
      </div>
    );

  return (
    <div className="absolute inset-0 flex h-screen items-center justify-center">
      <div className="max-w-md p-2 text-center text-4xl text-opacity-80">
        {data.map((data, index) => {
          return (
            <p
              key={index}
              style={{ fontFamily: data.font, fontSize: data.size }}
            >
              {data.p}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default Index;
