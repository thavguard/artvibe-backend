import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { AbilityBuilder, createMongoAbility, ExtractSubjectType, FieldMatcher, InferSubjects, MongoAbility } from '@casl/ability';
import { Action } from '../../authentication/enums/post-actions.enum';
import { PostEntity } from '../../posts/entities/post.entity';
import { Commentary } from 'src/posts/entities/commentaries.entity';
import { PostPhotoEntity } from 'src/posts/entities/post-photo.entity';
import { MessageEntity } from '../../messages/entities/message.entity';
import { MessageRoomEntity } from '../../messages/entities/message-room.entity';

type Subjects =
  InferSubjects<typeof PostEntity | typeof User | typeof Commentary | typeof PostPhotoEntity | typeof MessageRoomEntity>
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

export const fieldMatcher: FieldMatcher = fields => field => fields.includes(field);


@Injectable()
export class CaslAbilityFactory {
  constructor() {
  }

  async createForUser(user: User) {

    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility
    );

    console.log({ user });
    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    // User
    cannot(Action.Update, User, { id: user.id })
    cannot(Action.Delete, User, { id: user.id })


    // Post
    cannot(Action.Update, PostEntity, { user });
    cannot(Action.Delete, PostEntity, { user });

    // Comment
    cannot(Action.Update, Commentary, { user });
    cannot(Action.Delete, Commentary, { user });

    // Post photos
    cannot(Action.Update, PostPhotoEntity, { post: { user } });
    cannot(Action.Delete, PostPhotoEntity, { post: { user } });


    // Messages
    cannot(Action.Read, MessageRoomEntity, {
      users: {
        $elemMatch: {
          email: user.email,
        }
      }
    });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    });
  }
}
