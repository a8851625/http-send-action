const core = require('@actions/core');
const axios = require('axios');

function safeJsonParse(response, parseRule) {
  try {
      // 1. 确保response.data存在
      const data = response;

      // 2. 如果 parseRule 为 "."，则直接返回 data (response)
      if (parseRule === "." || parseRule === "") {
          return data;
      }

      // 3. 使用安全的链式访问
      const pathParts = parseRule.split('.');
      let result = data;

      for (const part of pathParts) {
          console.log(part);
          if (!result) return null;

          // 处理数组访问 (例如 choices[0])
          if (part.includes('[')) {
              const [arrayName, indexStr] = part.split('[');
              const index = parseInt(indexStr);

              result = result[arrayName];
              if (Array.isArray(result) && result.length > index) {
                  result = result[index];
              } else {
                  return null;
              }
          } else {
              result = result[part];
          }
      }

      return result;
  } catch (error) {
      console.error('解析错误:', error);
      return null;
  }
}

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
        parsedResult = safeJsonParse(response.data, parseRule);
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