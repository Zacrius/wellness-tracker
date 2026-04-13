import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// GraphQL Schema
const typeDefs = `#graphql
  type HealthTip {
    id: ID!
    text: String!
    category: String!
    source: String
  }

  type TipsPage {
    tips: [HealthTip!]!
    hasMore: Boolean!
    totalCount: Int!
  }

  type Query {
    healthTips: [HealthTip!]!
    tipOfTheDay: HealthTip
    healthTipsPaginated(page: Int!, limit: Int!): TipsPage!
  }
`;

// Mock Data
const healthTips = [
  {
    id: "1",
    text: "Drink at least 2L of water daily for optimal brain function",
    category: "hydration",
    source: "WHO",
  },
  {
    id: "2",
    text: "Sleep 7-8 hours to improve memory and immune function",
    category: "sleep",
    source: "NIH",
  },
  {
    id: "3",
    text: "Take a 5-minute movement break every hour to reduce back pain",
    category: "activity",
    source: "Mayo Clinic",
  },
  {
    id: "4",
    text: "Eat protein within 30 minutes after exercise for muscle recovery",
    category: "nutrition",
    source: "ACSM",
  },
  {
    id: "5",
    text: "Practice 5 minutes of deep breathing to lower cortisol levels",
    category: "mindfulness",
    source: "Harvard Health",
  },
  {
    id: "6",
    text: "Morning sunlight exposure regulates your circadian rhythm",
    category: "sleep",
    source: "Stanford Medicine",
  },
  {
    id: "7",
    text: "Stand up and stretch every 45 minutes to improve circulation",
    category: "activity",
    source: "CDC",
  },
  {
    id: "8",
    text: "Reduce sugar intake for sustained energy throughout the day",
    category: "nutrition",
    source: "ADA",
  },
];

// Resolvers
const resolvers = {
  Query: {
    healthTips: () => healthTips,
    tipOfTheDay: () =>
      healthTips[Math.floor(Math.random() * healthTips.length)],
    healthTipsPaginated: (_, { page, limit }) => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedTips = healthTips.slice(start, end);

      return {
        tips: paginatedTips,
        hasMore: end < healthTips.length,
        totalCount: healthTips.length,
      };
    },
  },
};

// Start Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Health Tips GraphQL server ready at ${url}`);
  console.log(`📊 Query health tips at: ${url}`);
};

startServer();
