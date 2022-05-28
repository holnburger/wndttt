import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Profile() {
  const { data, error } = useSWR("/api/random", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-md">
        <h1 className="whitespace-pre-line text-4xl">{data[0].wndttt}</h1>
        <p>{data[0].category}</p>
      </div>
    </div>
  );
}

export default Profile;
