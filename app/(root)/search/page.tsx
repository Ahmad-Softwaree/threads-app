import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Fragment } from "react";
export default async function page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoard) redirect("/onboarding");

  const { users, isNext } = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search bar */}

      <div className="mt-14 flex flex-col gap-0">
        {users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          <Fragment>
            {users.map((person: any) => {
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
    </section>
  );
}
