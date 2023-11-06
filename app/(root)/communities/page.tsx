import CommunityCard from "@/components/cards/CommunityCard";
import Pagination from "@/components/shared/Pagination";
import Search from "@/components/shared/Search";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Fragment } from "react";
async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoard) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>

      <div className="mt-5">
        <Search routeType="communities" />
      </div>
      {/* Search bar */}

      <div className="mt-14 flex flex-col gap-0">
        {result.communities.length === 0 ? (
          <p className="no-result">No communities</p>
        ) : (
          <Fragment>
            {result.communities.map((community: any) => {
              return (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                />
              );
            })}
          </Fragment>
        )}
      </div>

      <Pagination
        path="communities"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
}

export default page;
