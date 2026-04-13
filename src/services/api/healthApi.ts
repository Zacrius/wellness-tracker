export type HealthTip = {
  id: string;
  text: string;
  category: string;
  source?: string;
};

export type TipsPage = {
  tips: HealthTip[];
  hasMore: boolean;
  totalCount: number;
};

const GRAPHQL_URL =
  process.env.EXPO_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql";

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: { message: string }[];
};

export const fetchHealthTipsPaginated = async (
  page: number,
  limit: number,
): Promise<TipsPage> => {
  const query = `
    query GetHealthTipsPaginated($page: Int!, $limit: Int!) {
      healthTipsPaginated(page: $page, limit: $limit) {
        tips {
          id
          text
          category
          source
        }
        hasMore
        totalCount
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { page, limit },
    }),
  });

  const result =
    (await response.json()) as GraphQLResponse<{
      healthTipsPaginated: TipsPage;
    }>;

  const errorMessage = result.errors?.[0]?.message;
  if (errorMessage) throw new Error(errorMessage);
  if (!result.data) throw new Error("No data returned from GraphQL");

  return result.data.healthTipsPaginated;
};

export const fetchTipOfTheDay = async (): Promise<HealthTip | null> => {
  const query = `
    query TipOfTheDay {
      tipOfTheDay {
        id
        text
        category
        source
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const result =
    (await response.json()) as GraphQLResponse<{ tipOfTheDay: HealthTip | null }>;

  const errorMessage = result.errors?.[0]?.message;
  if (errorMessage) throw new Error(errorMessage);
  if (!result.data) throw new Error("No data returned from GraphQL");

  return result.data.tipOfTheDay;
};
