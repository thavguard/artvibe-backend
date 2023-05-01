import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "src/users/services/users.service";
import { FriendsEntity } from "./entities/friends.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FriendEntity } from "./entities/friend.entity";
import { User } from "src/users/entities/user.entity";
import { NotificationService } from "src/notifications/notifications.service";
import { NotificationType } from "src/notifications/enums/notification-types.enum";
import { NotificationsGateway } from "src/notifications/notifications.gateway";

@Injectable()
export class FriendsService {
  constructor(
    private readonly usersService: UserService,
    @InjectRepository(FriendsEntity)
    private readonly friendsRepository: Repository<FriendsEntity>,
    @InjectRepository(FriendEntity)
    private readonly friendRepository: Repository<FriendEntity>,
    private readonly NotificationService: NotificationService,
    private readonly NotificatonGateway: NotificationsGateway
  ) {}

  async findAll(): Promise<FriendsEntity[]> {
    return this.friendsRepository.find({
      relations: { friends: true, sentFriends: true, receivedFriends: true },
    });
  }

  async sendFriendRequest(
    userId: number,
    friendId: number
  ): Promise<FriendEntity> {
    const [user, friend] = await this.checkFriendsForUsers(userId, friendId);

    if (user.id === friend.id) {
      throw new BadRequestException(
        "Отсутствие друзей это не повод чтобы добавлять в друзья себя"
      );
    }

    let friendRequest = await this.findFriendRequestByUsers(user.id, friend.id);

    // if (friendRequest) {
    //     throw new BadRequestException('Вы уже отправляли заявку в друзья этому пользователю')
    // }

    friendRequest = await this.createFriend(user.id, friend.id);

    user.friends.sentFriends.push(friendRequest);
    friend.friends.receivedFriends.push(friendRequest);

    this.friendsRepository.save(user.friends);
    this.friendsRepository.save(friend.friends);

    const notification = await this.NotificationService.saveNotification(
      friend.id,
      {
        body: "У вас новый запрос в друзья",
        type: NotificationType.FriendRequest,
      }
    );

    this.NotificatonGateway.sendNotification(friend.id, notification);

    return friendRequest;
  }

  async acceptFriendRequest(
    userId: number,
    friendId: number
  ): Promise<boolean> {
    const [user, friend] = await this.checkFriendsForUsers(userId, friendId);

    const friendRequest = await this.findFriendRequestByUsers(
      friend.id,
      user.id
    );

    if (!friendRequest || friendRequest?.isAccepted) {
      throw new BadRequestException(
        "Вы уже приняли эту заявку, или ее вовсе не было"
      );
    }

    friendRequest.isAccepted = true;

    user.friends.receivedFriends = user.friends.receivedFriends.filter(
      (item) => item.id !== friendRequest.id
    );
    friend.friends.sentFriends = friend.friends.sentFriends.filter(
      (item) => item.id !== friendRequest.id
    );

    user.friends.friends.push(friend);
    friend.friends.friends.push(user);

    this.friendsRepository.save([user.friends, friend.friends]);

    this.friendRepository.save(friendRequest);

    const notification = await this.NotificationService.saveNotification(
      user.id,
      {
        body: `${friend.firstName} ${friend.lastName} принял вашу заявку в друзья`,
        type: NotificationType.Success,
      }
    );

    this.NotificatonGateway.sendNotification(user.id, notification);

    return true;
  }

  async rejectFriendRequest(
    userId: number,
    friendId: number
  ): Promise<boolean> {
    const [user, friend] = await this.checkFriendsForUsers(userId, friendId);

    const friendRequest = await this.findFriendRequestByUsers(
      friend.id,
      user.id
    );

    console.log(friendRequest);

    if (!friendRequest) {
      throw new BadRequestException();
    }

    user.friends.receivedFriends = user.friends.receivedFriends.filter(
      (item) => item.id !== friendRequest.id
    );
    friend.friends.sentFriends = friend.friends.sentFriends.filter(
      (item) => item.id !== friendRequest.id
    );

    this.friendsRepository.save([user.friends, friend.friends]);

    this.friendRepository.remove(friendRequest);

    const notification = await this.NotificationService.saveNotification(
      friend.id,
      {
        body: `${user.firstName} ${user.lastName} отклонил вашу заявку в друзья`,
        type: NotificationType.Error,
      }
    );

    this.NotificatonGateway.sendNotification(friend.id, notification);

    return true;
  }

  async removeFromFriends(userId: number, friendId: number): Promise<boolean> {
    const user = await this.usersService.findOneById(userId);
    const friend = await this.usersService.findOneById(friendId);

    if (!user.friends.friends.find((user) => user.id === friend.id)) {
      throw new BadRequestException("Этот пользователь и так вам не друг");
    }

    user.friends.friends = user.friends.friends.filter(
      (item) => item.id !== friend.id
    );
    friend.friends.friends = friend.friends.friends.filter(
      (item) => item.id !== user.id
    );

    const friendRequest = await this.findFriendRequestByUsers(
      friend.id,
      user.id
    );

    if (!friendRequest) {
      throw new BadRequestException("Ты удаляешь друга которого нет...");
    }

    this.friendsRepository.save([user.friends, friend.friends]);

    this.friendRepository.remove(friendRequest);

    return true;
  }

  private async createFriendsForUser(userId: number): Promise<FriendsEntity> {
    return this.friendsRepository.save(
      this.friendsRepository.create({
        user: { id: userId },
        receivedFriends: [],
        sentFriends: [],
        friends: [],
      })
    );
  }

  private async checkFriendsForUsers(
    userId: number,
    friendId: number
  ): Promise<[User, User]> {
    let user = await this.usersService.findOneById(userId);
    let friend = await this.usersService.findOneById(friendId);

    if (!user.friends) {
      user.friends = await this.createFriendsForUser(userId);
    }

    if (!friend.friends) {
      friend.friends = await this.createFriendsForUser(friendId);
    }

    return [user, friend];
  }

  private async createFriend(
    userId: number,
    friendId: number
  ): Promise<FriendEntity> {
    return this.friendRepository.save(
      this.friendRepository.create({
        user: { id: userId },
        friend: { id: friendId },
      })
    );
  }

  private async findFriendRequestById(
    requestId: number
  ): Promise<FriendEntity> {
    return this.friendRepository.findOneBy({ id: requestId });
  }

  private async findFriendRequestByUsers(
    userId: number,
    friendId: number
  ): Promise<FriendEntity> {
    return this.friendRepository.findOneBy({
      user: { id: userId },
      friend: { id: friendId },
    });
  }
}
