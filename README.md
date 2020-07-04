# todo-api

## What 

A node.js server that writes, edits and deletes key value pairs in a google spreadsheet

## Todo API Documentation

#### GET `/all`
Get all key value pairs from spreadsheet

Response Codes:
- 200: Successfully received all key value pairs
- 500: Something went wrong

Response Body:
```javascript
{
    result: number, // status code 
    data: { 
        "key1": "value1",
        "key2": "value2" 
    }
}
```

#### POST `/data`
Add new key value pair to spreadsheet, if key alreay exists it will be overwritten

Request Body:
```javascript
  {
    "Key": "value",
  }
```

Response Codes:
- 200: Updated key value pair
- 201: Key value pair created successfully
- 400: Bad Request. Request body can not be empty
- 415: Request header Content-Type must be `application/json`

Response Body:
```javascript
  {
      "result": number, // status code
      "description" : string // message
  }
```

#### DELETE `/Data/:key`
Deletes a key value pair 

- 200: Successfully deleted key value pair
- 404: Could not find key
- 500: Something went wrong

Response Body:
```javascript
  {
      "result": number, // status code
      "description" : string // message
  }
```