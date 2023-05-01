import { FindOptionsSelect } from "typeorm";
import { User } from "../entities/user.entity";

export const selectUserDto: FindOptionsSelect<User> = {
  id: true,
  firstName: true,
  lastName: true,
  avatar: {
    id: true,
    filename: true,
  },
};
