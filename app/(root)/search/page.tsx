import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import Search from "@/components/shared/Search";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Fragment } from "react";
export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoard) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search bar */}
      <Search routeType="search" />

      <div className="mt-14 flex flex-col gap-0">
        {result.users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          <Fragment>
            {result.users.map((person: any) => {
              return (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              );
            })}
          </Fragment>
        )}
      </div>

      <Pagination
        path="search"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
}
