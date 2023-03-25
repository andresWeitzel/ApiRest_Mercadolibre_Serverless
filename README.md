![Index app](./doc/assets/MicroService_Users_ML.drawio.png)

# Microservice_Mercadolibre_Users_AWS
Microservicio para la gestión de usuarios replicando y modificando parte de la arquitectura de desarrollo de ML  implementada con Systems Manager Parameter Store, Api-Gateway, Serverless-Framework, Lambda, NodeJs, Sequelize, Mysql, entre otros. Los servicios de aws se prueban en local. El código del proyecto y la documentación de este (menos doc técnica), ha sido desarrollado/a en inglés.
* [Repositorio base de datos](https://github.com/andresWeitzel/Microdb_MercadoLibre_Mysql)
* [Api Doc ML Usuarios](https://developers.mercadolibre.com.ar/es_ar/usuarios-y-aplicaciones)
* [Playlist prueba de funcionalidad](https://www.youtube.com/watch?v=oLSrmqMq0Zs&list=PLCl11UFjHurB9JzGtm5e8-yp52IcZDs5y)

<br>

## Índice 📜

<details>
 <summary> Ver </summary>
 
 <br>
 
### Sección 1) Descripción, configuración y tecnologías.

 - [1.0) Descripción del Proyecto.](#10-descripción-)
 - [1.1) Ejecución del Proyecto.](#11-ejecución-del-proyecto-)
 - [1.2) Configuración del proyecto desde cero](#12-configuración-del-proyecto-desde-cero-)
 - [1.3) Tecnologías.](#13-tecnologías-)

### Sección 2) Endpoints y Ejemplos 
 
 - [2.0) EndPoints y recursos.](#20-endpoints-y-recursos-)
 - [2.1) Ejemplos.](#21-ejemplos-)
 
### Sección 3) Prueba de funcionalidad y Referencias
 
 - [3.0) Prueba de funcionalidad.](#30-prueba-de-funcionalidad-)
 - [3.1) Referencias.](#31-referencias-)
	 

<br>

</details>



<br>

## Sección 1) Descripción, configuración y tecnologías. 


### 1.0) Descripción [🔝](#índice-) 

<details>
  <summary>Ver</summary>

 <br>

#### 1.0.0) Descripción General

  * El Microservicio está diseñado bajo la arquitectura MVC. Dicha arquitectura consta y está dividida en la capa de modelo (definición de la tabla user), la capa de servicio (la conexión y transacciones hacia la db con sequelize) y la capa controller (las lambdas implementadas). 
  * Cada lambda realiza la comprobación de autenticación de token, las que esperan un evento de tipo body comprueban dichos campos y toda la lógica a realizar se abstrae de la misma para desacoplar funcionalidades junto con bajo acoplamiento.
  * Los endpoints que permiten la devolución de más de un objeto según lógica de búsqueda aplicada se manejan con paginados caso de ser requerido. Se aplica paginación por defecto. 
 
 #### 1.0.0) Descripción Arquitectura y Funcionamiento
 
 * La imagen de la arquitectura de aws empleada describe el flujo de funcionamiento del microservicio de forma general. Cualquier petición hacia el microservicio parte desde un cliente (Postman, servidor, etc). Se emula dicho funcionamiento dentro de la misma red. 
 * `Paso 0` : Dicha solicitud es recibida por el api-gateway y solamente se validará si es que dentro de los encabezados de dicha solicitud se encuentra la x-api-key correcta.
 * `Pasos 1A, 1B, etc` : Todos estos pasos corresponden a un endpoint con su recurso especifico. Por ej. para getAllUsers (1A) es http://localhost:4000/dev/users/list ....revisar dichos endpoints en [sección endpoints](#sección-2-endpoints-y-ejemplos). Cada lambda realiza comprobación de x-api-key y token.
 * `Pasos 2` : Las lambdas realizan las validaciones de las ssm correspondientes con el System Manager Paramater Store.. validan token, valores de conexión con la db etc.
 * `Pasos 3` : Las lambdas realizan las transacciones y operaciones necesarios con la db (Mysql).


<br>

</details>


### 1.1) Ejecución del Proyecto [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 
* Una vez creado un entorno de trabajo a través de algún ide, clonamos el proyecto
```git
git clone https://github.com/andresWeitzel/Microservice_Mercadolibre_Users_AWS
```
* Nos posicionamos sobre el proyecto
```git
cd 'projectName'
```
* Instalamos Serverless Framework de forma global si es que aún no lo hemos realizado
```git
npm install -g serverless
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Instalamos todos los paquetes necesarios
```git
npm i
```
* Creamos un archivo para almacenar las variables ssm utilizadas en el proyecto (Más allá que sea un proyecto con fines no comerciales es una buena práctica utilizar variables de entorno).
  * Click der sobre la raíz del proyecto
  * New file
  * Creamos el archivo con el name `serverless_ssm.yml`. Este deberá estar a la misma altura que el serverless.yml
  * Añadimos las ssm necesarias dentro del archivo.
  ```git
    # Keys
    X_API_KEY : 'f98d8cd98h73s204e3456998ecl9427j'

    BEARER_TOKEN : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    # Test
    HELLO_TEST : 'HELLO_SSM_TEST'

    # Database
    DATABASE_NAME : 'microdb_mercadolibre'
    DATABASE_USER : 'root'
    DATABASE_PASSWORD : ''
    DATABASE_HOST : 'localhost'
    DATABASE_DIALECT : 'mysql'
    DATABASE_POOL_MAX : 5
    DATABASE_POOL_MIN : 0
    DATABASE_POOL_ACQUIRE : 30000
    DATABASE_POOL_IDLE : 10000

  ```  
* Ejecutamos el proyecto
```git
sls offline start
```
 
 
<br>

</details>


### 1.2) Configuración del proyecto desde cero [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>
 
  
* Creamos un entorno de trabajo a través de algún ide, luego de crear una carpeta nos posicionamos sobre la misma
```git
cd 'projectName'
```
* Instalamos Serverless Framework de forma global si es que aún no lo hemos realizado
```git
npm install -g serverless
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Inicializamos un template de serverles
```git
serverless create --template aws-nodejs
```
* Inicializamos un proyecto npm
```git
npm init -y
```
* Instalamos serverless offline 
```git
npm i serverless-offline --save-dev
```
* Instalamos serverless ssm 
```git
npm i serverless-offline-ssm --save-dev
```
* Ejecutamos el proyecto
```git
sls offline start
```



<br>

</details>

### 1.3) Tecnologías [🔝](#índice-)

<details>
  <summary>Ver</summary>


 <br>
 

| **Tecnologías** | **Versión** | **Finalidad** |               
| ------------- | ------------- | ------------- |
| [SDK](https://www.serverless.com/framework/docs/guides/sdk/) | 4.3.2  | Inyección Automática de Módulos para Lambdas |
| [Serverless Framework Core v3](https://www.serverless.com//blog/serverless-framework-v3-is-live) | 3.23.0 | Core Servicios AWS |
| [Systems Manager Parameter Store (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) | 3.0 | Manejo de Variables de Entorno |
| [Amazon Api Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) | 2.0 | Gestor, Autenticación, Control y Procesamiento de la Api | 
| [NodeJS](https://nodejs.org/en/) | 14.18.1  | Librería JS |
| [Sequelize](https://sequelize.org/) | ^6.11.0 | ORM |
| [Mysql](https://www.mysql.com/) | 10.1 | SGDB | 
| [XAMPP](https://www.apachefriends.org/es/index.html) | 3.2.2 | Paquete de servidores | 
| [VSC](https://code.visualstudio.com/docs) | 1.72.2  | IDE |
| [Postman](https://www.postman.com/downloads/) | 10.11  | Cliente Http |
| [CMD](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) | 10 | Símbolo del Sistema para linea de comandos | 
| [Git](https://git-scm.com/downloads) | 2.29.1  | Control de Versiones |

</br>


| **Plugin** | **Descarga** |               
| -------------  | ------------- |
| [Serverless Plugin](https://www.serverless.com/plugins/) | 6.2.2  | Librerías para la Definición Modular |
| [serverless-offline](https://www.npmjs.com/package/serverless-offline) |  https://www.serverless.com/plugins/serverless-offline |
| [serverless-offline-ssm](https://www.npmjs.com/package/serverless-offline-ssm) |  https://www.npmjs.com/package/serverless-offline-ssm |

</br>

| **Extensión** |              
| -------------  | 
| Prettier - Code formatter |
| YAML - Autoformatter .yml (alt+shift+f) |

<br>

</details>


<br>

## Sección 2) Endpoints y Ejemplos. 


### 2.0) Endpoints y recursos [🔝](#índice-) 

<details>
  <summary>Ver</summary>

### Operaciones de tipo GET:
* http://localhost:4000/dev/test
* http://localhost:4000/dev/db-connection
* http://localhost:4000/dev/users/list
* http://localhost:4000/dev/users/id/{user-id}
* http://localhost:4000/dev/users/country-id/{country-id}
* http://localhost:4000/dev/users/email/{email}
* http://localhost:4000/dev/users/first-name/{first-name}
* http://localhost:4000/dev/users/identification-number/{ident-number}
* http://localhost:4000/dev/users/identification-type/{ident-type}
* http://localhost:4000/dev/users/last-name/{last-name}
* http://localhost:4000/dev/users/nickname/{nickname}
* http://localhost:4000/dev/users/creation-date/{creation-date}
* http://localhost:4000/dev/users/update-date/{update-date}
* `Todos los endpoints son paginados opcionales menos el /test, /db-connection y /id/{user-id}`

### Operaciones de tipo POST:
* http://localhost:4000/dev/users/add-user/

### Operaciones de tipo PUT:
* http://localhost:4000/dev/users/update-user/{user-id}

### Operaciones de tipo DELETE:
* http://localhost:4000/dev/users/delete-user/{user-id}

### Aclaraciones
* {valor-requerido}
* Paginado por defecto : ?page=0&limit=5
* Paginado opcional : ?page={nro}&limit={nro}


<br>

</details>




### 2.1) Ejemplos [🔝](#índice-) 

<details>
  <summary>Ver</summary>

### 2.1.0) Operaciones de tipo GET

#### Obtener Usuarios paginados

#### Request
``` postman
- Método : GET

- Url : http://localhost:4000/dev/users/list?page=0&limit=10

- Headers: 
  - Content-Type : application/json
  - Authorization : Bearer {value}
  - x-api-key : {value}

- Body : null
```

#### Response
``` postman
{
    "message": {
        "id": 3,
        "nickname": "HECTOR SS G",
        "first_name": "Hector",
        "last_name": "Gomez",
        "email": "hectorGomez78@gmail.com",
        "identification_type": "DNI",
        "identification_number": "2172265827",
        "country_id": "AR",
        "creation_date": "2023-03-20 21:02:33",
        "update_date": "2023-03-20 21:02:33"
    }
}
```

#### Obtener un Usuario según su id

#### Request
``` postman
- Método : GET

- Url : http://localhost:4000/dev/users/id/2

- Headers: 
  - Content-Type : application/json
  - Authorization : Bearer {value}
  - x-api-key : {value}

- Body : null
```

#### Response
``` postman
{
    "message": {
        "id": 3,
        "nickname": "HECTOR SS G",
        "first_name": "Hector",
        "last_name": "Gomez",
        "email": "hectorGomez78@gmail.com",
        "identification_type": "DNI",
        "identification_number": "2172265827",
        "country_id": "AR",
        "creation_date": "2023-03-20 21:02:33",
        "update_date": "2023-03-20 21:02:33"
    }
}
```
<br>
* ETC.


### 2.1.1) Operaciones de tipo POST

#### Agregar un Usuario

#### Request
``` postman
- Método : POST

- Url : http://localhost:4000/dev/users/add-user/

- Headers: 
  - Content-Type : application/json
  - Authorization : Bearer {value}
  - x-api-key : {value}

- Body : 

   {
            "nickname": "TEST011212",
            "first_name": "TEST1212",
            "last_name": "TEST1212",
            "email": "TEST@gmail.com",
            "identification_type": "DNI",
            "identification_number": "445938822",
            "country_id": "AR12"
        }
```

#### Response
``` postman
{
    "message": {
        "id": null,
        "nickname": "TEST011212",
        "first_name": "TEST1212",
        "last_name": "TEST1212",
        "email": "TEST@gmail.com",
        "identification_type": "DNI",
        "identification_number": "445938822",
        "country_id": "AR12",
        "creation_date": "2023-03-24T21:33:49.000Z",
        "update_date": "2023-03-24T21:33:49.000Z"
    }
}
```

### 2.1.2) Operaciones de tipo PUT

#### Editar un Usuario

#### Request
``` postman
- Método : PUT

- Url : http://localhost:4000/dev/users/update-user/{user-id}

- Headers: 
  - Content-Type : application/json
  - Authorization : Bearer {value}
  - x-api-key : {value}

- Body (optionals fields) : 

  {
            "nickname": "TEST_UPDATED",
            "first_name": "TEST_UPDATED",
            "last_name": "TEST_UPDATED",
            "email": "TEST_UPDATED@gmail.com",
            "identification_type": "DNI",
            "identification_number": "445938822",
            "country_id": "AR12",
            "creation_date": "2023-03-24 21:33:49"
}
```

#### Response
``` postman
{
    "message": {
        "id": 14,
        "nickname": "TEST_UPDATED",
        "first_name": "TEST_UPDATED",
        "last_name": "TEST_UPDATED",
        "email": "TEST_UPDATED@gmail.com",
        "identification_type": "DNI",
        "identification_number": "445938822",
        "country_id": "AR12",
        "creation_date": "2023-03-25 00:33:49",
        "update_date": "2023-03-24 21:38:50"
    }
}
```


### 2.1.3) Operaciones de tipo DELETE

#### Eliminar un Usuario

#### Request
``` postman
- Método : DELETE

- Url : http://localhost:4000/dev/users/delete-user/{user-id}

- Headers: 
  - Content-Type : application/json
  - Authorization : Bearer {value}
  - x-api-key : {value}

- Body  : null
```

#### Response
``` postman
{
    "message": "User has been deleted successfully."
}
```



<br>

</details>




<br>


## Sección 3) Prueba de funcionalidad y Referencias. 


### 3.0) Prueba de funcionalidad [🔝](#índice-) 

<details>
  <summary>Ver</summary>

<br>

#### Tipos de Operaciones | [Ver](https://www.youtube.com/playlist?list=PLCl11UFjHurB9JzGtm5e8-yp52IcZDs5y)
![Index app](./doc/assets/playlist.png)

<br>

</details>


### 3.1) Referencias [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>

#### Configuración
 * [Cómo usar Sequelize con Node.js y MySQL](https://jasonwatmore.com/post/2022/06/26/nodejs-mysql-connect-to-mysql-database-with-sequelize-mysql2)
 * [Videotutorial Recomendado](https://www.youtube.com/watch?v=im7THL67z0c)

#### Herramientas 
 * [Herramienta de Diseño AWS app.diagrams.net](https://app.diagrams.net/?splash=0&libs=aws4)

#### Sequelize
 * [Modelos y Operadores](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)

#### Api Gateway
 * [Buenas Prácticas Api-Gateway](https://docs.aws.amazon.com/whitepapers/latest/best-practices-api-gateway-private-apis-integration/rest-api.html)
 * [Creación de Api-keys personalizadas](https://towardsaws.com/protect-your-apis-by-creating-api-keys-using-serverless-framework-fe662ad37447)

 #### Librerías
 * [Validación de campos](https://www.npmjs.com/package/node-input-validator)

<br>

</details>
