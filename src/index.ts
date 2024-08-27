import { Context, Schema } from 'koishi';

export const name = 'welcome-and-farewell';

export interface GroupConfig {
  welcomeMessage?: string;
  farewellMessage?: string;
  welcomeEnabled?: boolean;
  farewellEnabled?: boolean;
  approvalEnabled?: boolean;
}

export interface Config {
  defaultWelcomeMessage: string;
  defaultFarewellMessage: string;
  adminUserIds: string[];
  defaultApproval: boolean;
  verboseLogging: boolean; // 添加配置项
}

export const usage = `
### 插件名称
**Welcome and Farewell**

### 插件描述
该插件用于管理群组的入群欢迎消息、退群告别消息和入群审批功能。管理员可以为每个群组自定义欢迎和告别消息，并选择是否启用这些消息和入群审批功能。

### 配置项
- \`defaultWelcomeMessage\`：默认的入群欢迎消息。可以使用占位符 \`{userId}\` 来动态插入用户 ID。
- \`defaultFarewellMessage\`：默认的退群告别消息。可以使用占位符 \`{userId}\` 来动态插入用户 ID。
- \`adminUserIds\`：管理员用户 QQ 号列表，用于接收入群审批请求。
- \`defaultApproval\`：默认是否开启入群审核。
- \`verboseLogging\`：是否启用详细日志。

### 示例配置
\`\`\`json
{
  "defaultWelcomeMessage": "欢迎 [@{userId}] 入群！",
  "defaultFarewellMessage": "成员 [@{userId}] 已经退出群聊。",
  "adminUserIds": ["123456789", "987654321"],
  "defaultApproval": true,
  "verboseLogging": false
}
\`\`\`

### 指令介绍

#### 设置入群欢迎消息
\`setWelcomeMessage <guildId:string> <message:text>\`
- 用途：设置指定群组的入群欢迎消息。
- 示例：\`/setWelcomeMessage 123456 "欢迎 [@{userId}] 入群！"\`
- 说明：\`guildId\` 是群组的 ID，\`message\` 是欢迎消息。

#### 设置退群告别消息
\`setFarewellMessage <guildId:string> <message:text>\`
- 用途：设置指定群组的退群告别消息。
- 示例：\`/setFarewellMessage 123456 "成员 [@{userId}] 已经退出群聊。"\`
- 说明：\`guildId\` 是群组的 ID，\`message\` 是告别消息。

#### 启用或禁用入群欢迎消息
\`toggleWelcomeMessage <guildId:string> <enabled:boolean>\`
- 用途：启用或禁用指定群组的入群欢迎消息。
- 示例：\`/toggleWelcomeMessage 123456 true\`
- 说明：\`guildId\` 是群组的 ID，\`enabled\` 是布尔值，\`true\` 表示启用，\`false\` 表示禁用。

#### 启用或禁用退群告别消息
\`toggleFarewellMessage <guildId:string> <enabled:boolean>\`
- 用途：启用或禁用指定群组的退群告别消息。
- 示例：\`/toggleFarewellMessage 123456 false\`
- 说明：\`guildId\` 是群组的 ID，\`enabled\` 是布尔值，\`true\` 表示启用，\`false\` 表示禁用。

#### 启用或禁用入群审批功能
\`toggleApproval <guildId:string> <enabled:boolean>\`
- 用途：启用或禁用指定群组的入群审批功能。
- 示例：\`/toggleApproval 123456 true\`
- 说明：\`guildId\` 是群组的 ID，\`enabled\` 是布尔值，\`true\` 表示启用，\`false\` 表示禁用。

### 权限要求
- 只有权限等级高于或等于 3 的用户才能使用这些指令。

### 错误处理
- 如果用户权限不足，返回提示：\`你没有权限使用此命令。\`
- 其他错误会记录在控制台中，且不会影响正常消息发送。

### 使用示例

#### 设置入群欢迎消息
\`\`\`
/setWelcomeMessage 123456 "欢迎 [@{userId}] 入群！"
\`\`\`
上述命令会为群组 ID 为 123456 的群设置入群欢迎消息为 "欢迎 [@{userId}] 入群！"。

#### 设置退群告别消息
\`\`\`
/setFarewellMessage 123456 "成员 [@{userId}] 已经退出群聊。"
\`\`\`
上述命令会为群组 ID 为 123456 的群设置退群告别消息为 "成员 [@{userId}] 已经退出群聊。"。

#### 启用入群欢迎消息
\`\`\`
/toggleWelcomeMessage 123456 true
\`\`\`
上述命令会启用群组 ID 为 123456 的入群欢迎消息。

#### 禁用退群告别消息
\`\`\`
/toggleFarewellMessage 123456 false
\`\`\`
上述命令会禁用群组 ID 为 123456 的退群告别消息。

#### 启用入群审批功能
\`\`\`
/toggleApproval 123456 true
\`\`\`
上述命令会启用群组 ID 为 123456 的入群审批功能。
`;

export const Config: Schema<Config> = Schema.object({
  defaultWelcomeMessage: Schema.string().description('默认入群欢迎消息').default('欢迎 [@{userId}] 入群！').role('textarea'),
  defaultFarewellMessage: Schema.string().description('默认退群告别消息').default('成员 [@{userId}] 已经退出群聊。').role('textarea'),
  adminUserIds: Schema.array(Schema.string()).description('管理员用户 ID 列表').default([]),
  defaultApproval: Schema.boolean().description('默认是否开启入群审核').default(true),
  verboseLogging: Schema.boolean().description('是否启用详细日志').default(false),
});

export function apply(ctx: Context, config: Config) {
  const groupConfigs: Record<string, GroupConfig> = {};

  // 定义用户提及格式
  const userMention = '<at id="{userId}"/>';

  // 日志函数
  function logMessage(config: Config, message: string, isVerbose: boolean = false) {
    if (isVerbose || config.verboseLogging) {
      console.log(message);
    }
  }

  // 监听入群审批事件
  ctx.on('guild-member-request', async (session) => {
    logMessage(config, '触发事件：guild-member-request', true);
    const { userId, guildId, messageId } = session;
    const groupConfig = groupConfigs[guildId] || {};

    // 读取 approvalEnabled 配置，如果未设置则使用 config.defaultApproval
    const approvalEnabled = groupConfig.approvalEnabled !== undefined ? groupConfig.approvalEnabled : config.defaultApproval;
    logMessage(config, `[guild-member-request] guildId: ${guildId}, approvalEnabled: ${approvalEnabled}`, true);

    if (approvalEnabled) {
      logMessage(config, `[guild-member-request] Approval required for user ${userId} in guild ${guildId}`, true);
      try {
        const approvalMessage = `用户 [@${userId}] 请求加入群 ${guildId}。请管理员审批。`;

        // 向所有管理员发送审批请求
        for (const adminId of config.adminUserIds) {
          await session.bot.sendPrivateMessage(adminId, approvalMessage);
        }
        logMessage(config, `Sent approval request for user ${userId} in guild ${guildId} to admins`, true);
      } catch (error) {
        console.error('发送入群审批请求时出错:', error);
      }
    } else {
      // 如果未启用审批，则自动同意入群请求
      logMessage(config, `[guild-member-request] Auto-approving user ${userId} in guild ${guildId}`, true);
      try {
        await session.bot.handleGuildMemberRequest(messageId, true, '自动批准');
        logMessage(config, `自动批准用户 ${userId} 加入群 ${guildId}`);
      } catch (error) {
        console.error('自动批准入群请求时出错:', error);
      }
    }
  });

  // 监听群成员加入事件
  ctx.on('guild-member-added', async (session) => {
    const { userId, guildId } = session;
    const groupConfig = groupConfigs[guildId] || {};

    if (groupConfig.welcomeEnabled !== false) {
      const messageTemplate = groupConfig.welcomeMessage || config.defaultWelcomeMessage;
      const message = messageTemplate.replace('[@{userId}]', userMention.replace('{userId}', String(userId)));
      logMessage(config, 'Final welcome message before sending:');
      logMessage(config, message);
      try {
        await session.send(message);
        logMessage(config,`Sent welcome message to user ${userId} in guild ${guildId}`,true);
      } catch (error) {
        console.error('发送欢迎消息时出错:', error);
      }
    }
  });

  // 监听群成员退出事件
  ctx.on('guild-member-removed', async (session) => {
    const { userId, guildId } = session;
    const groupConfig = groupConfigs[guildId] || {};

    if (groupConfig.farewellEnabled !== false) {
      const messageTemplate = groupConfig.farewellMessage || config.defaultFarewellMessage;
      const message = messageTemplate.replace('[@{userId}]', userMention.replace('{userId}', String(userId)));
      logMessage(config, 'Final farewell message before sending:');
      logMessage(config, message);
      try {
        await session.send(message);
        logMessage(config, `Sent farewell message to user ${userId} in guild ${guildId}`, true);
      } catch (error) {
        console.error('发送告别消息时出错:', error);
      }
    }
  });

  const setGroupConfig = (guildId: string, key: keyof GroupConfig, value: any) => {
    if (!groupConfigs[guildId]) {
      groupConfigs[guildId] = {} as GroupConfig;
    }
    groupConfigs[guildId][key] = value as never;
  };

  // 注册设置命令
  ctx.command('setWelcomeMessage <guildId:string> <message:text>', '设置入群欢迎消息')
    .userFields(['authority'])
    .action(({ session }, guildId, message) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      logMessage(config, 'Setting welcome message:');
      logMessage(config, message);
      setGroupConfig(guildId, 'welcomeMessage', message);
      return `入群欢迎消息已为群 ${guildId} 设置。`;
    });

  ctx.command('setFarewellMessage <guildId:string> <message:text>', '设置退群告别消息')
    .userFields(['authority'])
    .action(({ session }, guildId, message) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      logMessage(config, 'Setting farewell message:');
      logMessage(config, message);
      setGroupConfig(guildId, 'farewellMessage', message);
      return `退群告别消息已为群 ${guildId} 设置。`;
    });

  ctx.command('toggleWelcomeMessage <guildId:string> <enabled:boolean>', '启用或禁用入群欢迎消息')
    .userFields(['authority'])
    .action(({ session }, guildId, enabled) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      setGroupConfig(guildId, 'welcomeEnabled', enabled);
      return enabled ? `入群欢迎消息已为群 ${guildId} 启用。` : `入群欢迎消息已为群 ${guildId} 禁用。`;
    });

  ctx.command('toggleFarewellMessage <guildId:string> <enabled:boolean>', '启用或禁用退群告别消息')
    .userFields(['authority'])
    .action(({ session }, guildId, enabled) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      setGroupConfig(guildId, 'farewellEnabled', enabled);
      return enabled ? `退群告别消息已为群 ${guildId} 启用。` : `退群告别消息已为群 ${guildId} 禁用。`;
    });

  ctx.command('toggleApproval <guildId:string> <enabled:boolean>', '启用或禁用入群审批功能')
    .userFields(['authority'])
    .action(({ session }, guildId, enabled) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      setGroupConfig(guildId, 'approvalEnabled', enabled);
      return enabled ? `入群审批功能已为群 ${guildId} 启用。` : `入群审批功能已为群 ${guildId} 禁用。`;
    });

  ctx.command('toggleVerboseLogging <enabled:boolean>', '启用或禁用详细日志')
    .userFields(['authority'])
    .action(({ session }, enabled) => {
      if (session.user.authority < 3) return '你没有权限使用此命令。';
      config.verboseLogging = enabled;
      return enabled ? '详细日志已启用。' : '详细日志已禁用。';
    });
}
