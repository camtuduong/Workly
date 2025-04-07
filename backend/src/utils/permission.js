const hasBoardPermission = (board, userId, allowedRoles = []) => {
  const member = board.members.find(
    (m) => m.userId.toString() === userId.toString()
  );

  return !!member && allowedRoles.includes(member.role);
};

module.exports = { hasBoardPermission };
