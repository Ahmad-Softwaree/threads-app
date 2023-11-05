import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";
export default async function page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoard) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <Fragment>
            {activity.map((activity: any) => {
              return (
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  <article className="activity-card">
                    <Image
                      src={activity.author.image}
                      alt="profile image"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.name}
                      </span>{" "}
                      replied to your thread
                    </p>
                  </article>
                </Link>
              );
            })}
          </Fragment>
        ) : (
          <p className="!text-base-regular text-light-3">No Activity Yet</p>
        )}
      </section>
    </section>
  );
}
