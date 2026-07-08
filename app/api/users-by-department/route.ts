import { NextResponse } from "next/server";
import {
  type DummyUser,
  groupUsersByDepartment,
} from "@/app/utils/users_by_department";

type DummyUsersApiResponse = {
  users: DummyUser[];
};

export async function GET() {
  try {
    const response = await fetch("https://dummyjson.com/users", {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch users from dummyjson.com" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as DummyUsersApiResponse;

    return NextResponse.json(groupUsersByDepartment(data.users));
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while grouping users by department" },
      { status: 500 },
    );
  }
}
