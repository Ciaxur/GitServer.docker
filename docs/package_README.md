## Git Server
Simple Personal API that stores Git Repositories. Easily interfaceable with REST Calls. This is the backend service for the full [GitServer.docker](https://github.com/Ciaxur/GitServer.docker) project.

## Limitations
Some of the features of which Repository Services such as **GitHub** and **GitLab** offers are not applicable here.

*   No User-Specific Permissions and Ownership
*   Requires a MongoDB instance to store repository metadata in
*   Interfaces only with REST Calls

## Usage
Here's a basic example of getting up and running.

### Docker-Compose
```yaml
version: '3.9'
services:
  git-server:
    build: .
    depends_on:
      - mongo
    environment:
      # OpenSSL Password. Default is 123
      SERVER_PASS: "$$6$$xyz$$73Q3Z.l5kN5BNAGMmP5IKozhqw3Zhj8bqQuJy3.Wf44.I3/nkSnzPMeX6rozvFiDHgi2DIt/BOc/lt14/2PH91"
      # OpenSSL Password. Default is 123
      WEBADMIN_PASS: "$$6$$xyz$$73Q3Z.l5kN5BNAGMmP5IKozhqw3Zhj8bqQuJy3.Wf44.I3/nkSnzPMeX6rozvFiDHgi2DIt/BOc/lt14/2PH91"
      DEBUG_ENABLE: "false"
      MONGODB_URL: "mongodb://root:password@192.168.0.3:27017" # MongoDB URL & Credentials
    volumes:
      - "./repos:/home/git"   # Stores the Git Repositories
      - "./logs:/logs"   # Stores the App's Logs
      - './git-server/build:/home/webadmin/git-server/build'  # Best used when DEBUG_ENABLE is true
    ports:
      - "3000:3000"
      - "22:22"
```

### Parameters
Below is a table for all the parameters for which the server expects. All of those parameters are required but configurable to your application needs. Under `Docker-Compose`, `-p` would relate to **ports**, `-e` -> **environment**, and `-v` -> **volumes**.

### Git Server Service
| Parameter | Function |
| :----: | --- |
| `-e SERVER_PASS=<pass-hash>` | Internal `git` User's password - See below for explanation |
| `-e WEBADMIN_PASS=<pass-hash>` | Internal `webadmin` User's password - See below for explanation |
| `-e DEBUG_ENABLE=<true/false>` | (_Optional_) Runs the express app in dev-mode, reloading the app when files in the `build` path changes and responding with DEBUG entires in REST Calls |
| `-e MONGODB_URL=<url>` | MongoDB full URL with Credentials |
| `-p 3000` | maps container's internal 3000 port to the host's 3000 port. Express App Endpoint |
| `-p 22` | maps container's internal 22 port to the host's 22 port. SSH Port, used for Git Clone |
| `-v /home/git` | Stores Git Repositories |
| `-v /logs` | Stores App's Logs |
| `-v /home/webadmin/git-server/build` | (_Optional_) Where DEBUG_ENABLE's option will be best used. Stores express app build |

### Generating Password Hash
In order to generate a password hash, simply use the following command where `<pass>` is your plaintext password and `<salt>` is the salt for the hash.

❗️ **IMPORTANT** ❗️  
For each `$` in the generated password hash, add an extra `$` for the `docker-compose` yaml config. So if the hash was **$somehash$** then it would be inputted as **$$somehash$$** in the yaml config.

openssl passwd -salt xyz -6 123

### API Routes
These are the various routes that the API handles.

### Repo Route
`GET /repo`: Fetches entire list of all the available repositories on the Server.
```ts
// Response
{
  message: string,
  data: {
    title:         string,
    description:   string,
    updatedAt:     Date,
    createdAt:     Date,
  }[],  // Array
}
```

`GET /repo:title`: Fetches the Repository information given Repo's Title
```ts
// Response
{
  message: string,  // Found or Not
  data: {  // Data or Null if not Found
    repo: {
      title:         string,
      description:   string,
      updatedAt:     Date,
      createdAt:     Date,
    },
    link: string,
  } | null,
}
```

`POST /repo`: Create a Repository given request. Handles if Duplicate is found
```ts
// Request
{
  title:         string,
  description:   string,
}
```
```ts
// Response
{
  message:         string,
  debug:           object, // If DEBUG_ENABLE is set
}
```

`DELETE /repo:title`: Deletes the Repository given Repo's Title
```ts
// Response
{
  message:         string,
  debug:           object, // If DEBUG_ENABLE is set
}
```

`PATCH /repo:title`: Patches the Repository given Repo's Title and Body to update to
```ts
// Request
{
  title:         string,
  description:   string,
}
```
```ts
// Response
{
  message:         string,
  debug:           object, // If DEBUG_ENABLE is set
}
```

### Updates
**Git-Server 1.1.1**
- Added RepoWatcher which updates the `UpdatedAt` metadata of each Repository