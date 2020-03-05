# Proof of concept microservices distribution

## Getting Started
1. Clone or download this repository.
2. Install docker (enable Linux containers - right click the docker icon in the system tray and select 'Switch to Linux containers' if already using Windows Containers).
3. Update the ip address in `docker-compose.yml` to your ip.
4. Go to the repository root and run `docker-compose up`.

To query the api you can import `Paris.postman_collection.json`. The two apis are running at `localhost:3000` and `localhost:3001` respectively - in future a reverse proxy could be used to allow access on a single port.
Web interfaces are available for the two databases at `localhost:8081` and `localhost:8082`.

## Architecture
Consists of two microservices:
1. units (node.js)
2. materials (node.js)

### Database structure
Both have dedicated MongoDb databases:
1. units collections:
    * units (primary data store)
      * _id
      * name
      * shortName
      * type (0 = length, 1 = density) - simplified
    * materials (material cache for unit deletion) ** TODO **
      * _id
      * densityUnitId
2. materials collections:
    * materials (primary data store)
      * _id
      * name
      * externalName
      * ultimateTensileStrength
      * strainHardeningCoefficient
      * bendingMaterialType
      * density
        * value
        * unitId
    * units (unit cache for material density validation):
      * _id
      * shortName

### Communication
Inter-service communication is achieved using [Apache Kafka](https://kafka.apache.org/) which operates a publish-subscribe model.
Example event:
```json
{
  "mode": "create",
  "value": {
    "_id": "8277f7c1-eabe-4774-ae80-07c97e31eeed",
    "name": "kilograms per cubic metre",
    "shortName": "kg/m3",
    "type": 1
  }
}
```


### Endpoints
All endpoints are included in `Paris.postman_collection.json`.

## Limitations
* No authentication or user management
* No concurrency checks
* Limited validation (unique name check & unit existence check is about it!)
