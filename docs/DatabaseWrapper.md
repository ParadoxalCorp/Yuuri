<a name="DatabaseWrapper"></a>

## DatabaseWrapper
**Kind**: global class

* [DatabaseWrapper](#DatabaseWrapper)
    * [new DatabaseWrapper(client)](#new_DatabaseWrapper_new)
    * [.init()](#DatabaseWrapper+init) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.connect([host], [port])](#DatabaseWrapper+connect) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getGuild(id)](#DatabaseWrapper+getGuild) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getUser(id)](#DatabaseWrapper+getUser) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.set(data, type)](#DatabaseWrapper+set) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.createDatabase(name)](#DatabaseWrapper+createDatabase) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.createTable(name, databaseName)](#DatabaseWrapper+createTable) ⇒ <code>Promise.&lt;boolean&gt;</code>

<a name="new_DatabaseWrapper_new"></a>

### new DatabaseWrapper(client)
Wraps the most important methods of RethinkDB and does smart things in the background


| Param | Type | Description |
| --- | --- | --- |
| client | <code>object</code> | The client (or bot) instance |

<a name="DatabaseWrapper+init"></a>

### databaseWrapper.init() ⇒ <code>Promise.&lt;void&gt;</code>
Initialize the database wrapper, this will start the automatic progressive caching of the database and dynamically handle disconnections

**Kind**: instance method of [<code>DatabaseWrapper</code>](#DatabaseWrapper)
**Returns**: <code>Promise.&lt;void&gt;</code> - - An error will be rejected if something fail when establishing the changes stream
<a name="DatabaseWrapper+connect"></a>

### databaseWrapper.connect([host], [port]) ⇒ <code>Promise.&lt;object&gt;</code>
Establish a simple connection to a RethinkDB server

**Kind**: instance method of [<code>DatabaseWrapper</code>](#DatabaseWrapper)
**Returns**: <code>Promise.&lt;object&gt;</code> - - The established connection object

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [host] | <code>string</code> | <code>&quot;config.database.host&quot;</code> | The host name to connect to |
| [port] | <code>number</code> | <code>config.database.port</code> | The port of the host name to connect to |

<a name="DatabaseWrapper+getGuild"></a>

### databaseWrapper.getGuild(id) ⇒ <code>Promise.&lt;object&gt;</code>
Get a guild database entry

**Kind**: instance method of [<code>DatabaseWrapper</code>](#DatabaseWrapper)
**Returns**: <code>Promise.&lt;object&gt;</code> - - The guild entry object, or null if not in the database

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The unique identifier of the guild to get |

<a name="DatabaseWrapper+getUser"></a>

### databaseWrapper.getUser(id) ⇒ <code>Promise.&lt;object&gt;</code>
Get a user database entry

**Kind**: instance method of [<code>DatabaseWrapper</code>](#DatabaseWrapper)
**Returns**: <code>Promise.&lt;object&gt;</code> - - The user entry object, or null if not in the database

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The unique identifier of the user to get |

<a name="DatabaseWrapper+set"></a>

### databaseWrapper.set(data, type) ⇒ <code>Promise.&lt;object&gt;</code>
Insert or update a user/guild in the database

**Kind**: instance method of [<code>DatabaseWrapper</code>](#DatabaseWrapper)
**Returns**: <code>Promise.&lt;object&gt;</code> - - The inserted/updated object, or reject the error if any

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The data object to update/insert in the database |
| type | <code>string</code> | Can be "guild" or "user", whether the data object to be set is a guild or a user |

<a name="DatabaseWrapper+createDatabase"></a>

### databaseWrapper.createDatabase(name) ⇒ <code>Promise.&lt;boolean&gt;</code>
Create a new database

**Kind**: instance method of [<code>DatabaseWrapper</code>](#DatabaseWrapper)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - true if success, otherwise, the error is rejected

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the database to create, if there is already a database with this name, the promise will be resolved and nothing will change |

<a name="DatabaseWrapper+createTable"></a>

### databaseWrapper.createTable(name, databaseName) ⇒ <code>Promise.&lt;boolean&gt;</code>
Create a new table in the specified database

**Kind**: instance method of [<code>DatabaseWrapper</code>](#DatabaseWrapper)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - true if success, otherwise, the error is rejected

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the table to create, if there is already a table with this name, the promise will be resolved and nothing will change |
| databaseName | <code>string</code> | The name of the database to create the table in |