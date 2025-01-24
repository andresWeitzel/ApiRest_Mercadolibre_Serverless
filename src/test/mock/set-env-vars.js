// Mock Testing
process.env.MOCK_BOOLEAN_VALUE_01 = false;
process.env.MOCK_NUMBER_VALUE_01 = 16287426;
process.env.MOCK_STRING_VALUE_01 = "MOCK_STRING";
process.env.MOCK_OBJECT_VALUE_01 = 'TEST_01';
process.env.MOCK_OBJECT_VALUE_02 = 'TEST_02';
process.env.MOCK_VALID_OBJECT_01 = '12315236751236516235';
//Keys
process.env.X_API_KEY = 'f98d8cd98h73s204e3456998ecl9427j'
process.env.BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
process.env.MOCK_INVALID_X_API_KEY_01 = "f98d8cd98h73s204e3456998ecknaksdnakndkn";
process.env.MOCK_INVALID_BEARER_TOKEN_01 = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fyheqwh";
process.env.MOCK_INVALID_BEARER_TOKEN_02 = "BB7ASDJA1";
// Database
process.env.DATABASE_NAME = 'microdb_mercadolibre'
process.env.DATABASE_USER = 'root'
process.env.DATABASE_PASSWORD = ''
process.env.DATABASE_HOST = '127.0.0.1'
process.env.DATABASE_PORT = 3306
process.env.DATABASE_DIALECT = 'mysql'
process.env.DATABASE_POOL_MAX = 5
process.env.DATABASE_POOL_MIN = 0
process.env.DATABASE_POOL_ACQUIRE = 30000
process.env.DATABASE_POOL_IDLE = 10000
//Generic
process.env.APP_LOCALHOST= 'http://127.0.0.1'
//Swagger
process.env.SWAGGER_BASE_PATH_CORS= 'http://127.0.0.1/swagger/'
process.env.SWAGGER_BASE_PATH_CORS= '*'