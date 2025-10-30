import requests
import numpy as np
import json
import random

device='019a361e-1e0d-737a-ba70-4ce844330c42'
shocker=[]

dev = requests.get(
    f"https://api.openshock.app/1/devices/{device}/shockers",
    headers={
      "OpenShockToken": "kUH9pi6cmRjke4ADvcOoQOyY9tURe0ObNw6hZMlHnTc6PJi8mCd1Gae3tGnH1ESy"
    }
)

for i in json.loads(dev.content)["data"]:
    shocker.append(i["id"])

winner = random.choice(shocker)

requests.post(
    "https://api.openshock.app/1/shockers/control",
    headers={
      "Content-Type": "application/json",
      "OpenShockToken": "kUH9pi6cmRjke4ADvcOoQOyY9tURe0ObNw6hZMlHnTc6PJi8mCd1Gae3tGnH1ESy"
    },
    json=[
      {
        "id": winner,
        "type": "shock",
        "intensity": 5,
        "duration": 300,
        "exclusive": True
      }
    ]
)                                                                                                                                                                                                                                            
