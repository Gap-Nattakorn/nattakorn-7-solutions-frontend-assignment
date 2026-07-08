export type DummyUser = {
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female" | string;
  hair: {
    color: string;
  };
  address: {
    postalCode: string;
  };
  company: {
    department: string;
  };
};

export type DepartmentSummary = {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
};

export type DepartmentSummaryResponse = Record<string, DepartmentSummary>;

type DepartmentAccumulator = DepartmentSummary & {
  minAge: number;
  maxAge: number;
};

function createAccumulator(): DepartmentAccumulator {
  return {
    male: 0,
    female: 0,
    ageRange: "",
    hair: {},
    addressUser: {},
    minAge: Number.POSITIVE_INFINITY,
    maxAge: Number.NEGATIVE_INFINITY,
  };
}

export function groupUsersByDepartment(
  users: DummyUser[],
): DepartmentSummaryResponse {
  const departmentMap = new Map<string, DepartmentAccumulator>();

  for (const user of users) {
    const department = user.company.department;
    const current = departmentMap.get(department) ?? createAccumulator();

    if (user.gender === "male") {
      current.male += 1;
    }

    if (user.gender === "female") {
      current.female += 1;
    }

    current.minAge = Math.min(current.minAge, user.age);
    current.maxAge = Math.max(current.maxAge, user.age);
    current.hair[user.hair.color] = (current.hair[user.hair.color] ?? 0) + 1;
    current.addressUser[`${user.firstName}${user.lastName}`] =
      user.address.postalCode;

    departmentMap.set(department, current);
  }

  const response: DepartmentSummaryResponse = {};

  for (const [department, summary] of departmentMap) {
    response[department] = {
      male: summary.male,
      female: summary.female,
      ageRange: `${summary.minAge}-${summary.maxAge}`,
      hair: summary.hair,
      addressUser: summary.addressUser,
    };
  }

  return response;
}
