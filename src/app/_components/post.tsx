"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs dark:text-white">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
<input
  type="text"
  placeholder="Title"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full rounded-full px-4 py-2 
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-500 dark:placeholder:text-gray-400
    border border-gray-200 dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
    hover:border-gray-300 dark:hover:border-gray-600
    transition-colors duration-200"
/><button
  type="submit"
  className="rounded-full px-10 py-3 font-semibold transition-all duration-200
    bg-blue-500 dark:bg-blue-600 
    hover:bg-blue-600 dark:hover:bg-blue-700
    text-white
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-sm hover:shadow-md
    transform hover:scale-[1.02]"
  disabled={createPost.isPending}
>
  {createPost.isPending ? "Submitting..." : "Submit"}
</button>      </form>
    </div>
  );
}
