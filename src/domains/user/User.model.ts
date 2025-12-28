const selectDataUser = {
  select: {
    id: true,
    username: true,
    employee: {
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    },
  },
};

export { selectDataUser };
