import qs from "qs";

export const populateItem = {
  users_permissions_user: {
    populate: "*",
  },
  images: {
    populate: "*",
  },
};

export const queryGetItemsByUser = (userId: number) => {
  const query = qs.stringify(
    {
      filters: {
        users_permissions_user: {
          id: {
            $eq: userId,
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  return query;
};

export const queryGetItemByUser = (userId: number, itemId: number) => {
  const query = qs.stringify(
    {
      populate: populateItem,
      filters: {
        users_permissions_user: {
          id: {
            $eq: userId,
          },
        },
        id: {
          $eq: itemId,
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  return query;
};
