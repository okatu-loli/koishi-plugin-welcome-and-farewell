import { Context } from 'koishi';
import {Config} from './index';
import {logMessage, userMention} from "./utils";
import {getValidGroupConfig} from "./database";

// 注册事件
export function registerEvents(ctx: Context, config: Config) {
  // 获取默认配置
  const defaultConfig = {
    guildId: 'default',
    welcomeMessage: config.defaultWelcomeMessage,
    farewellMessage: config.defaultFarewellMessage,
    welcomeEnabled: true,
    farewellEnabled: true,
    approvalEnabled: config.defaultApproval,
  };

  ctx.on('guild-member-added', async (session) => {
    logMessage(config, 'guild-member-added 事件触发');
    const guildConfig = await getValidGroupConfig(ctx, session.guildId, defaultConfig);
    logMessage(config, `群组配置: ${JSON.stringify(guildConfig)}`);
    if (guildConfig.welcomeEnabled) {
      const welcomeMessage = guildConfig.welcomeMessage || config.defaultWelcomeMessage;
      await session.send(welcomeMessage.replace('{userId}', userMention.replace('{userId}', session.userId)));
    }
  });

  ctx.on('guild-member-removed', async (session) => {
    logMessage(config, 'guild-member-removed 事件触发');
    const guildConfig = await getValidGroupConfig(ctx, session.guildId, defaultConfig);
    logMessage(config, `群组配置: ${JSON.stringify(guildConfig)}`);
    if (guildConfig.farewellEnabled) {
      const farewellMessage = guildConfig.farewellMessage || config.defaultFarewellMessage;
      await session.send(farewellMessage.replace('{userId}', userMention.replace('{userId}', session.userId)));
    }
  });

  ctx.on('guild-member-request', async (session) => {
    logMessage(config, 'guild-request 事件触发');
    const guildConfig = await getValidGroupConfig(ctx, session.guildId, defaultConfig);
    logMessage(config, `群组配置: ${JSON.stringify(guildConfig)}`);
    if (guildConfig.approvalEnabled) {
      const adminUsers = await ctx.database.get('group_admins', { guildId: session.guildId });
      for (const admin of adminUsers) {
        await session.bot.sendPrivateMessage(admin.userId, `新的入群请求：${session.userId}，消息 ID: ${session.messageId}`);
      }
    }
  });
}
