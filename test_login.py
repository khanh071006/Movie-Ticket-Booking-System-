import urllib.request
import json

url = 'http://localhost:8080/api/v1/auth/login'
data = json.dumps({"email":"khanh@gmail.com","password":"123"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except Exception as e:
    print(e)
