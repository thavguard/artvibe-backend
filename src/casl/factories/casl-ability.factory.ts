import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { Action } from '../../authentication/enums/post-actions.enum';
import { PostEntity } from '../../posts/entities/post.entity';
import { Commentary } from 'src/posts/entities/commentaries.entity';
import { JwtStrategyValidateDto } from '../../authentication/dtos/jwt-strategy-validate.dto';
import { UserService } from '../../users/users.service';
import { PostPhotoEntity } from 'src/posts/entities/post-photo.entity';

type Subjects = InferSubjects<typeof PostEntity | typeof User | typeof Commentary | typeof PostPhotoEntity> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor() {
  }

  async createForUser(user: User) {

    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility
    );

    console.log(user);
    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }


    // Post
    cannot(Action.Update, PostEntity, { user });
    cannot(Action.Delete, PostEntity, { user })

    // Comment
    cannot(Action.Update, Commentary, { user });
    cannot(Action.Delete, Commentary, { user })

    // Post photos
    cannot(Action.Update, PostPhotoEntity, { post: { user } })
    cannot(Action.Delete, PostPhotoEntity, { post: { user } })

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>
    });
  }
}
