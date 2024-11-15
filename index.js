const core = require('@actions/core');
const axios = require('axios');

async function run() {
  try {
    // 获取输入
    const url = core.getInput('url');
    const method = core.getInput('method').toUpperCase();
    const headers = core.getInput('headers') ? JSON.parse(core.getInput('headers')) : {};
    const body = core.getInput('body');
    const parseRule = core.getInput('parse');

    // 发送 HTTP 请求
    const response = await axios({
      url,
      method,
      headers,
      data: body
    });

    // 设置完整响应
    core.setOutput('status', response.status);
    core.setOutput('response', JSON.stringify(response.data));

    // 处理用户自定义解析（若提供了 parseRule）
    let parsedResult;
    if (parseRule) {
      try {
        // 使用 Function 构造动态函数来解析响应数据
        parsedResult = new Function('response', `return response.${parseRule};`)(response.data);
      } catch (error) {
        parsedResult = `Failed to parse with rule "${parseRule}": ${error.message}`;
      }
    } else {
      parsedResult = "No parseRule provided";  // 若无解析规则，提示未设置
    }

    // 设置辅助解析结果的输出
    core.setOutput('parsedResult', parsedResult);

  } catch (error) {
    core.setFailed(`Request failed: ${error.message}`);
  }
}

run();