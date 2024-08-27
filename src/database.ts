import { Context } from 'koishi';
import { GroupConfig } from './index';

// 获取群组配置
export async function getGroupConfig(ctx: Context, guildId: string): Promise<GroupConfig> {
  const configs = await ctx.database.get('group_config', { guildId }) as GroupConfig[];
  return configs[0] || { guildId } as GroupConfig;
}

// 保存群组配置
export async function saveGroupConfig(ctx: Context, config: GroupConfig) {
  await ctx.database.upsert('group_config', [config], ['guildId']);
}

// 获取有效的群组配置
export async function getValidGroupConfig(ctx: Context, guildId: string, defaultConfig: GroupConfig): Promise<GroupConfig> {
  const configs = await ctx.database.get('group_config', { guildId }) as GroupConfig[];
  if (configs.length > 0) {
    return configs[0];
  } else {
    return defaultConfig;
  }
}
