import { Context } from 'koishi';
import { Config } from './index';
import { getGroupConfig, saveGroupConfig } from './database';
import { logMessage } from './utils';

export function registerCommands(ctx: Context, config: Config) {
  const defaultConfig = {
    guildId: 'default',
    welcomeMessage: config.defaultWelcomeMessage,
    farewellMessage: config.defaultFarewellMessage,
    welcomeEnabled: true,
    farewellEnabled: true,
    approvalEnabled: config.defaultApproval,
  };

  ctx.command('setWelcomeMessage <guildId:string> <message:text>', '设置入群欢迎消息')
    .userFields(['authority'])
    .action(async ({ session }, guildId, message) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      const existingConfig = await getGroupConfig(ctx, guildId) || { guildId };
      existingConfig.welcomeMessage = message;
      existingConfig.welcomeEnabled = existingConfig.welcomeEnabled ?? true;
      await saveGroupConfig(ctx, existingConfig);
      return `已设置群组 ${guildId} 的入群欢迎消息为: ${message}`;
    });

  ctx.command('setFarewellMessage <guildId:string> <message:text>', '设置退群告别消息')
    .userFields(['authority'])
    .action(async ({ session }, guildId, message) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      const existingConfig = await getGroupConfig(ctx, guildId) || { guildId };
      existingConfig.farewellMessage = message;
      existingConfig.farewellEnabled = existingConfig.farewellEnabled ?? true;
      await saveGroupConfig(ctx, existingConfig);
      return `已设置群组 ${guildId} 的退群告别消息为: ${message}`;
    });

  ctx.command('toggleWelcomeMessage <guildId:string> <enabled:boolean>', '启用或禁用入群欢迎消息')
    .userFields(['authority'])
    .action(async ({ session }, guildId, enabled) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      const existingConfig = await getGroupConfig(ctx, guildId) || { guildId };
      existingConfig.welcomeEnabled = enabled;
      await saveGroupConfig(ctx, existingConfig);
      return `已${enabled ? '启用' : '禁用'}群组 ${guildId} 的入群欢迎消息。`;
    });

  ctx.command('toggleFarewellMessage <guildId:string> <enabled:boolean>', '启用或禁用退群告别消息')
    .userFields(['authority'])
    .action(async ({ session }, guildId, enabled) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      const existingConfig = await getGroupConfig(ctx, guildId) || { guildId };
      existingConfig.farewellEnabled = enabled;
      await saveGroupConfig(ctx, existingConfig);
      return `已${enabled ? '启用' : '禁用'}群组 ${guildId} 的退群告别消息。`;
    });

  ctx.command('toggleApproval <guildId:string> <enabled:boolean>', '启用或禁用入群审批功能')
    .userFields(['authority'])
    .action(async ({ session }, guildId, enabled) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      const existingConfig = await getGroupConfig(ctx, guildId) || { guildId };
      existingConfig.approvalEnabled = enabled;
      await saveGroupConfig(ctx, existingConfig);
      return `已${enabled ? '启用' : '禁用'}群组 ${guildId} 的入群审批功能。`;
    });

  ctx.command('approveJoinRequest <messageId:string> <approve:boolean>', '同意或拒绝入群请求')
    .userFields(['authority'])
    .action(async ({ session }, messageId, approve) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      await session.bot.handleGuildMemberRequest(messageId, approve, approve ? '自动批准' : '自动拒绝');
      return `已${approve ? '同意' : '拒绝'}入群请求，消息 ID: ${messageId}`;
    });

  ctx.command('addAdmin <guildId:string> <userId:string>', '添加管理员')
    .userFields(['authority'])
    .action(async ({ session }, guildId, userId) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      await ctx.database.upsert('group_admins', [{ guildId, userId }]);
      return `已添加管理员 ${userId} 到群组 ${guildId}`;
    });

  ctx.command('removeAdmin <guildId:string> <userId:string>', '移除管理员')
    .userFields(['authority'])
    .action(async ({ session }, guildId, userId) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      await ctx.database.remove('group_admins', { guildId, userId });
      return `已从群组 ${guildId} 中移除管理员 ${userId}`;
    });
}
