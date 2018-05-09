# Giftr API 

All the calls to the server after the initial connect call will require a token to be passed through the querystring.

The base URL for all the calls is [https://griffis.edumedia.ca/mad9023/giftr/](https://griffis.edumedia.ca/mad9023/giftr/). The URLs must all end with a "/".


All the responses from the server will contain AT LEAST a code and a message field. If the code value is zero then everything worked fine. The message field is for information purposes only.

```javascript
{"code":0, "message":"What you wanted to do did the thing you wanted."}
```

## Connect
To use the giftr API you must start by calling the connect page
[https://griffis.edumedia.ca/mad9023/giftr/connect/?device_id=](https://griffis.edumedia.ca/mad9023/giftr/connect/?device_id=)

The connect page requires **device_id** be passed through the querystring.
It will return a JSON object containing a token. 
```javascript
{
    "code": 0,
    "message": "Session started",
    "token": "09cb7790bd2ea4c5643b9b98b0a97303"
}
```

This token must be used for ALL other calls to the server API.

## List of People

After you connect you can use your token to request a list of people that belong to the device account.
[https://griffis.edumedia.ca/mad9023/giftr/people/?token=](https://griffis.edumedia.ca/mad9023/giftr/people/?token=)

For this call to work you must pass **token** through the querystring.

It will return a JSON object with an array of people.
```javascript
{
    "code": 0,
    "message": "List of people",
    "people": [
    {"person_id":1, "person_name":"John Smith", "dob": "1990-12-12"}
    ]
}
```

## List of Gifts

If you want to view a list of gifts for a specific person then you need to call
[https://griffis.edumedia.ca/mad9023/giftr/gifts/?token=](https://griffis.edumedia.ca/mad9023/giftr/gifts/?token=)

You must pass **token** through the querystring and **person_id** through a FORM DATA POST.

It will return a JSON object with an array of gifts.
### Note 
The fields may be empty. Only the title is required when adding. The gift_url will be URL encoded.


```javascript
{
    "code": 0,
    "message": "List of gifts",
    "gifts": [
        {"gift_id":1, 
         "gift_title":"Cheese", 
         "gift_price":12.50, 
         "gift_store":"Walmart", 
         "gift_url":"http%3a%2f%2fwww.walmart.com%2f"}
    ]
}
```

## Add Person

Adding a person is done through a call to 
[https://griffis.edumedia.ca/mad9023/giftr/people/add/?token=](https://griffis.edumedia.ca/mad9023/giftr/people/add/?token=).

A **token** must be passed through the queryString. 

Other data must be passed through a FormData object sent via POST. The fields to send are **person_name** and **dob** (Date of Birth).

The response will be a JSON object containing the newly created person, the code and the message.
```javascript
{"code":0, "message":"Person added", "person":{
    "person_id": 244,
    "person_name": "Captain Jack Sparrow",
    "dob": "1975-12-16"
}}
```


## Delete Person

Deleting a person is done through a call to [https://griffis.edumedia.ca/mad9023/giftr/people/delete/?token=](https://griffis.edumedia.ca/mad9023/giftr/people/delete/?token=).

A **token** must be passed through the queryString. 

A **person_id** must be passed through a FormData object with the POST method.

The response will be a JSON object with code, message, and id of person deleted.
```javascript
{"code":0, "message":"Person was deleted", "person":{"person_id":123}}
```

## Edit Person

Editing a person is done through a call to 
[https://griffis.edumedia.ca/mad9023/giftr/people/edit/?token=](https://griffis.edumedia.ca/mad9023/giftr/people/edit/?token=). It works much the same way as the add person.

A **token** must be passed through the queryString. 

Other data must be passed through a FormData object sent via POST. The fields to send are **person_name**, **person_id**, and **dob** (Date of Birth).

The response will be a JSON object containing the newly created person, the code and the message.
```javascript
{"code":0, "message":"Person edited", "person":{
    "person_id": 244,
    "person_name": "Captain Jack Sparrow",
    "dob": "1975-12-16"
}}
```

## Add Gift

Adding a gift is done through a call to 
[https://griffis.edumedia.ca/mad9023/giftr/gifts/add/?token=](https://griffis.edumedia.ca/mad9023/giftr/gifts/add/?token=).

A **token** must be passed through the queryString. 

Other data must be passed through a FormData object sent via POST. The fields to send are **person_id**, **gift_title**,  **gift_url**, **gift_price**, and **gift_store**.

The response will be a JSON object containing the newly created gift, the code and the message.
```javascript
{"code":0, "message":"Gift added", "gift":{
    "person_id": 244,
    "gift_id": 453,
    "gift_title": "XKCD Book",
    "gift_url": "",
    "gift_store": "Chapters",
    "gift_price": 19.99
}}
```

## Delete Gift
Deleting a gift is done through a call to 
[https://griffis.edumedia.ca/mad9023/giftr/gifts/delete/?token=](https://griffis.edumedia.ca/mad9023/giftr/gifts/delete/?token=).

A **token** must be passed through the queryString. 

A **gift_id** must be passed through a FormData object with the POST method.

The response will be a JSON object with code, message, and id of gift deleted.
```javascript
{"code":0, "message":"Gift was deleted", "gift":{"gift_id":123}}
```

## Edit Gift

Editing a gift is done through a call to 
[https://griffis.edumedia.ca/mad9023/giftr/gifts/add/?token=](https://griffis.edumedia.ca/mad9023/giftr/gifts/add/?token=). It is done much the same way as adding a gift.

A **token** must be passed through the queryString. 

Other data must be passed through a FormData object sent via POST. The fields to send are **person_id**, **gift_id**, **gift_title**,  **gift_url**, **gift_price**, and **gift_store**.

The response will be a JSON object containing the newly created gift, the code and the message.
```javascript
{"code":0, "message":"Gift edited", "gift":{
    "person_id": 244,
    "gift_id": 453,
    "gift_title": "XKCD Book",
    "gift_url": "",
    "gift_store": "Chapters",
    "gift_price": 19.99
}}
```