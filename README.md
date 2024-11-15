# HTTP Request Action

This GitHub Action allows you to make HTTP requests and parse the response data.

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| url | The URL to send the request to | Yes | - |
| method | HTTP method (GET, POST, PUT, DELETE, etc.) | Yes | GET |
| headers | Request headers in JSON format | No | {} |
| body | Request body | No | - |
| parse | Rule to parse the response (e.g., "data.items[0].id") | No | - |

## Outputs

| Name | Description |
|------|-------------|
| status | HTTP status code of the response |
| response | Full response data |
| parsedResult | Parsed result based on provided parse rule |

## Example Usage

```yaml
- name: Make HTTP Request
  uses: your-username/http-request-action@v1
  with:
    url: 'https://api.example.com/data'
    method: 'POST'
    headers: '{"Authorization": "Bearer token123"}'
    body: '{"key": "value"}'
    parse: 'data.items[0].id'