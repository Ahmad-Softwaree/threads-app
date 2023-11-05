import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchSingleThread } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo.onBoard) redirect("/onboarding");

  const thread = await fetchSingleThread(params.id);
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImage={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((item: any) => {
          return (
            <ThreadCard
              key={item._id}
              id={item._id}
              currentUserId={item.user?.id}
              parentId={item.parentId}
              content={item.text}
              author={item.author}
              community={item.community}
              createdAt={item.createdAt}
              comments={item.children}
              isComment={true}
            />
          );
        })}
      </div>
    </section>
  );
}

export default page;
