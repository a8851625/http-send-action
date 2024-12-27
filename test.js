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
  
// 使用示例
const response = {"id":"chatcmpl-NewBing","object":"chat.completion.chunk","created":1731655156,"model":"Balanced-g4t-18k","system_fingerprint":"BnrBA4oJKFjI","choices":[{"index":0,"delta":{"content":null},"message":{"role":"assistant","content":"Sure, here's the weather overview for Shenzhen this week:\n\n- **Today**: Cloudy, currently 80°F which is approximately 26.7°C. The high is expected to be 81°F (27.2°C) and the low 74°F (23.3°C). Precipitation chance is 38%, with sunrise at 6:36 AM and sunset at 5:39 PM[^1^].\n\n- **Tomorrow**: Mostly sunny with a high of 85°F (29.4°C) and a low of 75°F (23.9°C)[^1^].\n\nFor more detailed forecasts for the rest of the week, you can check the provided link[^1^]. Would you like to know about any specific day?\n\n[^1^]: [Weather Information](https://a.msn.com/54/EN-US/ct22.5437,114.0579?ocid=ansmsnweather)\n[^2^]: [14 Day Weather Shenzhen - meteoblue](https://www.meteoblue.com/en/weather/14-days/shenzhen_china_1795564)\n[^3^]: [14 Day Weather Shenzhen - meteoblue](https://www.meteoblue.com/en/weather/14-days/shenzhen_china_1795565)\n[^4^]: [Shenzhen, Guangdong, China 14 day weather forecast - timeanddate.com](https://www.timeanddate.com/weather/china/shenzhen/ext)\n[^5^]: [Shenzhen, Guangdong, China 14 day weather forecast - timeanddate.com](https://www.timeanddate.com/weather/@1795563/ext)"},"finish_reason":"stop"}]}
const parseRule = "";
const result = safeJsonParse(response, parseRule);
console.log('解析结果:', JSON.stringify(result));
// 生成N个测试用例