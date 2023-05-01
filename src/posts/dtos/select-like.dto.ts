import { FindOptionsSelect } from "typeorm";
import { Like } from "../entities/like.entity";
import { selectUserDto } from "src/users/dtos/select-user.dto";

export const selectLikeDto: FindOptionsSelect<Like> = {
  id: true,
  user: selectUserDto,
};
