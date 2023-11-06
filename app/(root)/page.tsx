import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import { Fragment } from "react";

export default async function Home() {
  const { isNext, threads } = await fetchThreads(1, 30);
  const user = await currentUser();
  if (!user) return null;
  return (
    <main>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {threads.length === 0 ? (
          <p className="no-result">No Threads Found</p>
        ) : (
          <Fragment>
            {threads.map((thread) => {
              return (
                <ThreadCard
                  key={thread._id}
                  id={thread._id}
                  currentUserId={user?.id}
                  parentId={thread.parentId}
                  content={thread.text}
                  author={thread.author}
                  community={thread.community}
                  createAt={thread.createAt}
                  comments={thread.children}
                />
              );
            })}
          </Fragment>
        )}
      </section>
    </main>
  );
}
