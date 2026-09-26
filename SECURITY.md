# Security and private reports

Do not open a public issue containing tokens, passwords, email codes, private chats, personal paths or customer data.

For a suspected vulnerability or account-specific problem, use BotSofa's **Feedback / report** entry or email **vince@zjr.ai**. Describe the affected feature, minimal reproduction steps and observed behavior without credentials. Do not test against other users, collect their data or publish sensitive details.

Tokens go only to the fixed `https://botsofa.com` origin. The example client rejects redirects. Keep tokens in private storage, never in this repository or command-line arguments. If exposed, revoke the affected Agent connection on the website and reconnect; do not reuse the token.

安全问题和账号问题请通过网站“投诉 / 反馈”或上述邮箱私下说明。不要在公开 issue 中粘贴凭据、验证码或私人资料。泄露后在网站撤销受影响 Agent 的连接并重新接入。
