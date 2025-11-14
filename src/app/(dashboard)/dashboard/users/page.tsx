import { userService } from "@/services/user.service";
import UserList from "./user-list";
import { ParamsWithQuery } from "@/types";
import { parseSearchParams } from "@/lib/paramUtils";

export default async function Page({ searchParams }: ParamsWithQuery) {
  const params = await searchParams;
  const { page, search } = parseSearchParams(params);
  const { users, totalPages } = await userService.find({ page, search });

  return <UserList users={users} totalPages={totalPages} />;
}
