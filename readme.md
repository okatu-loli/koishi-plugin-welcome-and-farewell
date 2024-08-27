# koishi-plugin-welcome-and-farewell

[![npm](https://img.shields.io/npm/v/koishi-plugin-welcome-and-farewell?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-welcome-and-farewell)

A plugin to send welcome and farewell messages when members join or leave the group

### 插件名称
**Welcome and Farewell**

### 插件描述
该插件用于管理群组的入群欢迎消息和退群告别消息。管理员可以为每个群组自定义欢迎和告别消息，并选择是否启用这些消息。

### 配置项
- `defaultWelcomeMessage`：默认的入群欢迎消息。可以使用占位符 `{userId}` 来动态插入用户 ID。
- `defaultFarewellMessage`：默认的退群告别消息。可以使用占位符 `{userId}` 来动态插入用户 ID。

### 示例配置
```json
{
  "defaultWelcomeMessage": "欢迎 [@{userId}] 入群！",
  "defaultFarewellMessage": "成员 [@{userId}] 已经退出群聊。"
}
```

### 指令介绍

#### 1. 设置入群欢迎消息
**指令：**
```
/setWelcomeMessage <guildId:string> <message:text>
```
**描述：**
为指定的群组设置自定义的入群欢迎消息。

**参数：**
- `guildId`：群组的唯一标识符。
- `message`：自定义的欢迎消息，可以使用占位符 `[@{userId}]` 插入新成员的用户 ID。

**示例：**
```
/setWelcomeMessage 123456789 "欢迎 [@{userId}] 加入我们！"
```
**预期结果：**
```
入群欢迎消息已为群 123456789 设置。
```

#### 2. 设置退群告别消息
**指令：**
```
/setFarewellMessage <guildId:string> <message:text>
```
**描述：**
为指定的群组设置自定义的退群告别消息。

**参数：**
- `guildId`：群组的唯一标识符。
- `message`：自定义的告别消息，可以使用占位符 `[@{userId}]` 插入离开成员的用户 ID。

**示例：**
```
/setFarewellMessage 123456789 "再见 [@{userId}]，希望你将来一切顺利！"
```
**预期结果：**
```
退群告别消息已为群 123456789 设置。
```

#### 3. 启用或禁用入群欢迎消息
**指令：**
```
/toggleWelcomeMessage <guildId:string> <enabled:boolean>
```
**描述：**
启用或禁用指定群组的入群欢迎消息。

**参数：**
- `guildId`：群组的唯一标识符。
- `enabled`：布尔值，`true` 表示启用，`false` 表示禁用。

**示例：**
```
/toggleWelcomeMessage 123456789 true
```
**预期结果：**
```
入群欢迎消息已为群 123456789 启用。
```

#### 4. 启用或禁用退群告别消息
**指令：**
```
/toggleFarewellMessage <guildId:string> <enabled:boolean>
```
**描述：**
启用或禁用指定群组的退群告别消息。

**参数：**
- `guildId`：群组的唯一标识符。
- `enabled`：布尔值，`true` 表示启用，`false` 表示禁用。

**示例：**
```
/toggleFarewellMessage 987654321 true
```
**预期结果：**
```
退群告别消息已为群 987654321 启用。
```

### 权限要求
- 只有权限等级高于或等于 3 的用户才能使用这些指令。

### 错误处理
- 如果用户权限不足，返回提示：`你没有权限使用此命令。`
- 其他错误会记录在控制台中，且不会影响正常消息发送。

### 使用示例
假设你是一个群管理员，你想为群组 `123456789` 设置自定义的欢迎消息，并启用它。你可以按如下步骤操作：

1. 设置欢迎消息：
   ```
   /setWelcomeMessage 123456789 "欢迎 [@{userId}] 加入我们！"
   ```
   预期结果：
   ```
   入群欢迎消息已为群 123456789 设置。
   ```

2. 启用欢迎消息：
   ```
   /toggleWelcomeMessage 123456789 true
   ```
   预期结果：
   ```
   入群欢迎消息已为群 123456789 启用。
   ```

通过这些指令，你可以轻松管理每个群组的欢迎和告别消息，提升群组的互动性和管理效率。
