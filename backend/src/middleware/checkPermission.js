const Board = require("../models/Board");
const mongoose = require("mongoose");

const checkPermission = (roleRequired) => {
  return async (req, res, next) => {
    const { boardId } = req.params;
    const userId = req.user.id;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const userMember = board.members.find(
      (member) => member.userId.toString() === userId
    );

    if (!userMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this board" });
    }

    if (roleRequired && userMember.role !== roleRequired) {
      return res.status(403).json({
        message: `You must be a ${roleRequired} to perform this action`,
      });
    }

    next();
  };
};

module.exports = checkPermission;
