export default
  {
    User: {
      role(user) {
        return user.role;
      },
    },
    Role: {
      users(role) {
        return role.users;
      },
    },
  };
