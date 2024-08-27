# koishi-plugin-welcome-and-farewell

[![npm](https://img.shields.io/npm/v/koishi-plugin-welcome-and-farewell?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-welcome-and-farewell)

A plugin to send welcome and farewell messages when members join or leave the group

### 插件名称
**Welcome and Farewell**

### 插件描述
该插件用于管理群组的入群欢迎消息、退群告别消息和入群审批功能。管理员可以为每个群组自定义欢迎和告别消息，并选择是否启用这些消息和入群审批功能。

### 配置项
- `defaultWelcomeMessage`：默认的入群欢迎消息。可以使用占位符 `{userId}` 来动态插入用户 ID。
- `defaultFarewellMessage`：默认的退群告别消息。可以使用占位符 `{userId}` 来动态插入用户 ID。
- `adminUserIds`：管理员用户 QQ 号列表，用于接收入群审批请求。
- `defaultApproval`：默认是否开启入群审核。
- `verboseLogging`：是否启用详细日志。

### 示例配置
```json
{
  "defaultWelcomeMessage": "欢迎 [@{userId}] 入群！",
  "defaultFarewellMessage": "成员 [@{userId}] 已经退出群聊。",
  "adminUserIds": ["123456789", "987654321"],
  "defaultApproval": true,
  "verboseLogging": false
}
```

### 指令介绍

#### 设置入群欢迎消息
`setWelcomeMessage <guildId:string> <message:text>`
- 用途：设置指定群组的入群欢迎消息。
- 示例：`/setWelcomeMessage 123456 "欢迎 [@{userId}] 入群！"`
- 说明：`guildId` 是群组的 ID，`message` 是欢迎消息。

#### 设置退群告别消息
`setFarewellMessage <guildId:string> <message:text>`
- 用途：设置指定群组的退群告别消息。
- 示例：`/setFarewellMessage 123456 "成员 [@{userId}] 已经退出群聊。"`
- 说明：`guildId` 是群组的 ID，`message` 是告别消息。

#### 启用或禁用入群欢迎消息
`toggleWelcomeMessage <guildId:string> <enabled:boolean>`
- 用途：启用或禁用指定群组的入群欢迎消息。
- 示例：`/toggleWelcomeMessage 123456 true`
- 说明：`guildId` 是群组的 ID，`enabled` 是布尔值，`true` 表示启用，`false` 表示禁用。

#### 启用或禁用退群告别消息
`toggleFarewellMessage <guildId:string> <enabled:boolean>`
- 用途：启用或禁用指定群组的退群告别消息。
- 示例：`/toggleFarewellMessage 123456 false`
- 说明：`guildId` 是群组的 ID，`enabled` 是布尔值，`true` 表示启用，`false` 表示禁用。

#### 启用或禁用入群审批功能
`toggleApproval <guildId:string> <enabled:boolean>`
- 用途：启用或禁用指定群组的入群审批功能。
- 示例：`/toggleApproval 123456 true`
- 说明：`guildId` 是群组的 ID，`enabled` 是布尔值，`true` 表示启用，`false` 表示禁用。

### 权限要求
- 只有权限等级高于或等于 3 的用户才能使用这些指令。

### 错误处理
- 如果用户权限不足，返回提示：`你没有权限使用此命令。`
- 其他错误会记录在控制台中，且不会影响正常消息发送。

### 使用示例

#### 设置入群欢迎消息
```
/setWelcomeMessage 123456 "欢迎 [@{userId}] 入群！"
```
上述命令会为群组 ID 为 123456 的群设置入群欢迎消息为 "欢迎 [@{userId}] 入群！"。

#### 设置退群告别消息
```
/setFarewellMessage 123456 "成员 [@{userId}] 已经退出群聊。"
```
上述命令会为群组 ID 为 123456 的群设置退群告别消息为 "成员 [@{userId}] 已经退出群聊。"。

#### 启用入群欢迎消息
```
/toggleWelcomeMessage 123456 true
```
上述命令会启用群组 ID 为 123456 的入群欢迎消息。

#### 禁用退群告别消息
```
/toggleFarewellMessage 123456 false
```
上述命令会禁用群组 ID 为 123456 的退群告别消息。

#### 启用入群审批功能
```
/toggleApproval 123456 true
```
上述命令会启用群组 ID 为 123456 的入群审批功能。
