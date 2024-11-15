function safeJsonParse(response, parseRule) {
    try {
        // 1. 确保response.data存在
        const data = response.data || response;
        
        // 2. 使用安全的链式访问
        const pathParts = parseRule.split('.');
        let result = data;
        
        for (const part of pathParts) {
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
const response = {
    data: {
        "id": "chatcmpl-NewBing",
        "choices": [{
            "message": {
                "content": "测试内容1"
            }
        },
        {
            "message": {
                "content": "测试内容2"
            }
        },
        
        ]
    }
};
const parseRule = "choices[1].message";
const result = safeJsonParse(response, parseRule);
console.log('解析结果:', result);