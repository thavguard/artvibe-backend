import { Injectable } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from "@casl/ability";
import { Action } from "../../authentication/enums/post-actions.enum";
import { PostEntity } from "../../posts/entities/post.entity";

type Subjects = InferSubjects<typeof PostEntity | typeof User> | "all";

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility
    );

    console.log(user);
    if (user.isAdmin) {
      can(Action.Manage, "all");
    } else {
      can(Action.Read, "all");
    }

    can(Action.Update, PostEntity, { user: { id: user.id } });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
