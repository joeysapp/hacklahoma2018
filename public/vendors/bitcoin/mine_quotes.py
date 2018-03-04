# encoding=utf8

import urllib, json

def clean(s):
    return s[1:-1]

def process(x):
    id_ = x["id"]
    bronze_ = x['BRONZE']
    silver_ = x['SILVER']
    gold_ = x['GOLD']
    platinum_ = x['PLATINUM']
    purch_ = x['PURCHASED']
    paid = 0
    
    if purch_ == 'Bronze':
        paid_ = bronze_
    elif purch_ == 'Silver':
        paid_ = silver_
    elif purch_ == "Gold":
        paid_ = gold_
    else:
        paid_ = platinum_
    
    return (id_,bronze_,silver_,gold_,platinum_,paid_,purch_)

def searchURL(start, end):
    return "https://v3v10.vitechinc.com/solr/v_us_quotes/select?indent=on&q=id:[" + str(start) + "%20TO%20" + str(end) + "]&rows=10000&wt=json"

masterData = []

last_num = 0
cur_num = 1
for i in range(2000):
    url = searchURL(cur_num, cur_num+10000)
    response = urllib.urlopen(url)
    data = json.loads(response.read())
    myData = map(process, data["response"]["docs"])
    myData.sort(key = lambda x : int(x[0]))
    if len(myData) == 0 or last_num == cur_num:
        break
    else:
        print(myData[0][0], len(myData))
        masterData += myData
        last_num = cur_num
        cur_num = int(myData[-1][0]) + 1
    
print len(masterData)

filename = "v_us_quotes.csv"
file = open(filename, "w")
for line in masterData:
    file.write(','.join(map(str,line)))
    file.write("\n")
file.close()
