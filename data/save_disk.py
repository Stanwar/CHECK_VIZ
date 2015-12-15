import json 
import simplejson
from pprint import pprint 

with open('zipcodeboundary.json') as data_file : 
	data = json.loads(data_file)

simplejson.loads(data)

pprint(data)
